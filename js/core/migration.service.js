/* Wellness PWA Schema Versioning & Migration Infrastructure Service - P0A-1B */

(function (global) {
  'use strict';

  const APP_SCHEMA_VERSION = 3;
  const APP_VERSION = "2.3.0";

  const SCHEMA_METADATA_KEY = 'wellness_schema_metadata';
  const RECOVERY_SNAPSHOT_KEY = 'wellness_migration_recovery_snapshot';

  const MIGRATION_STATES = {
    IDLE: 'idle',
    PREPARING: 'preparing',
    RUNNING: 'running',
    VALIDATING: 'validating',
    COMPLETED: 'completed',
    FAILED: 'failed',
    ROLLED_BACK: 'rolled_back'
  };

  const MONITORED_USER_KEYS = [
    'wellness_habits_data',
    'wellness_weight_logs_data',
    'wellness_weight_goal_data',
    'wellness_food_logs_data',
    'wellness_evening_reviews_data',
    'wellness_saved_quotes_data',
    'wellness_daily_reactions_data',
    'wellness_app_settings_data',
    'wellness_health_history_logs',
    'wellness_tomorrow_actions_data'
  ];

  // Utility: SHA-256 Hex
  async function computeSha256(str) {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const msgBuffer = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    if (typeof require !== 'undefined') {
      const nodeCrypto = require('crypto');
      return nodeCrypto.createHash('sha256').update(str).digest('hex');
    }
    return 'unsupported_hash';
  }

  function toCanonicalJsonString(obj) {
    if (obj === null || typeof obj !== 'object') {
      return JSON.stringify(obj);
    }
    if (Array.isArray(obj)) {
      return '[' + obj.map(toCanonicalJsonString).join(',') + ']';
    }
    const sortedKeys = Object.keys(obj).sort();
    const parts = sortedKeys.map(k => JSON.stringify(k) + ':' + toCanonicalJsonString(obj[k]));
    return '{' + parts.join(',') + '}';
  }

  // Registry for sequential migration transformers (e.g. 1 -> 2, 2 -> 3)
  const MIGRATION_REGISTRY = {
    1: async (snapshotData) => {
      const habitsRaw = snapshotData['wellness_habits_data'];
      if (!habitsRaw) return snapshotData;

      let habits = [];
      try {
        habits = JSON.parse(habitsRaw);
      } catch (e) {
        return snapshotData;
      }

      if (!Array.isArray(habits)) return snapshotData;

      const transformedHabits = habits.map((habit, habitIdx) => {
        const h = { ...habit };
        if (h.activationModeEnabled === undefined) h.activationModeEnabled = false;
        if (!h.minimumCompletions) h.minimumCompletions = [];
        
        if (!h.completionRecords) {
          h.completionRecords = [];
          if (Array.isArray(h.completions)) {
            h.completions.forEach((dateStr, idx) => {
              const isMin = h.minimumCompletions.includes(dateStr);
              h.completionRecords.push({
                id: 'rec_v1_' + (h.id || habitIdx) + '_' + idx + '_' + Date.now(),
                habitId: h.id || ('h_' + habitIdx),
                localDate: dateStr,
                completionLevel: isMin ? 'minimum' : 'legacy_complete',
                completedAt: dateStr + 'T12:00:00.000Z'
              });
            });
          }
        }
        return h;
      });

      snapshotData['wellness_habits_data'] = JSON.stringify(transformedHabits);
      return snapshotData;
    },
    2: async (snapshotData) => {
      if (!snapshotData['wellness_tomorrow_actions_data']) {
        snapshotData['wellness_tomorrow_actions_data'] = JSON.stringify([]);
      }
      return snapshotData;
    }
  };

  class MigrationService {
    constructor(storageAdapter = null) {
      this.storage = storageAdapter || (typeof localStorage !== 'undefined' ? localStorage : null);
    }

    getMetadata() {
      if (!this.storage) return null;
      try {
        const raw = this.storage.getItem(SCHEMA_METADATA_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    setMetadata(meta) {
      if (!this.storage) return;
      this.storage.setItem(SCHEMA_METADATA_KEY, JSON.stringify(meta));
    }

    initSchemaMetadata() {
      let meta = this.getMetadata();
      if (!meta) {
        meta = {
          schemaVersion: APP_SCHEMA_VERSION,
          appVersion: APP_VERSION,
          lastMigrationAt: null,
          migrationState: MIGRATION_STATES.IDLE,
          migrationId: null,
          fromVersion: null,
          toVersion: null,
          failedAt: null,
          errorCode: null
        };
        this.setMetadata(meta);
      }
      return meta;
    }

    captureCurrentStorageSnapshot() {
      const snapshot = {};
      MONITORED_USER_KEYS.forEach(key => {
        const val = this.storage ? this.storage.getItem(key) : null;
        snapshot[key] = val;
      });
      return snapshot;
    }

    async createRecoverySnapshot(fromVersion, toVersion) {
      const payloadSnapshot = this.captureCurrentStorageSnapshot();
      const payloadString = toCanonicalJsonString(payloadSnapshot);
      const checksum = await computeSha256(payloadString);

      const snapshotRecord = {
        fromVersion,
        toVersion,
        timestamp: new Date().toISOString(),
        checksum,
        data: payloadSnapshot
      };

      if (this.storage) {
        this.storage.setItem(RECOVERY_SNAPSHOT_KEY, JSON.stringify(snapshotRecord));
      }
      return snapshotRecord;
    }

    async validateRecoverySnapshot(snapshotRecord) {
      if (!snapshotRecord || typeof snapshotRecord !== 'object' || !snapshotRecord.data) {
        return { valid: false, error: 'Snapshot structure missing' };
      }
      const payloadString = toCanonicalJsonString(snapshotRecord.data);
      const computed = await computeSha256(payloadString);
      if (snapshotRecord.checksum !== computed) {
        return { valid: false, error: 'Snapshot checksum mismatch (corrupted recovery snapshot)' };
      }
      return { valid: true };
    }

    validatePreMigration(meta, targetVersion) {
      const errors = [];
      const warnings = [];

      if (!meta) {
        errors.push('Schema metadata is missing.');
      } else {
        if (meta.schemaVersion >= targetVersion) {
          warnings.push(`Target version ${targetVersion} is not greater than active schema version ${meta.schemaVersion}.`);
        }
        if (meta.migrationState === MIGRATION_STATES.RUNNING || meta.migrationState === MIGRATION_STATES.PREPARING) {
          errors.push(`Previous migration is still in state '${meta.migrationState}'.`);
        }
      }

      return { valid: errors.length === 0, errors, warnings };
    }

    validatePostMigration(preSnapshot, postSnapshot) {
      const errors = [];
      const warnings = [];

      if (!postSnapshot) {
        errors.push('Post-migration snapshot is missing.');
        return { valid: false, errors, warnings };
      }

      // Check key integrity
      MONITORED_USER_KEYS.forEach(key => {
        if (postSnapshot[key] !== undefined && postSnapshot[key] !== null) {
          try {
            JSON.parse(postSnapshot[key]);
          } catch (e) {
            errors.push(`Key '${key}' contains malformed JSON post-migration.`);
          }
        }
      });

      return { valid: errors.length === 0, errors, warnings };
    }

    async runMigrationDryRun(targetVersion) {
      const meta = this.initSchemaMetadata();
      const currentVer = meta.schemaVersion;

      const report = {
        sourceSchema: currentVer,
        targetSchema: targetVersion,
        recordsInspected: 0,
        warnings: [],
        errors: [],
        expectedChanges: [],
        dryRunPassed: false
      };

      if (targetVersion > APP_SCHEMA_VERSION && !MIGRATION_REGISTRY[currentVer]) {
        report.errors.push(`No registered migration path from v${currentVer} to v${targetVersion}.`);
        return report;
      }

      if (targetVersion <= currentVer) {
        report.warnings.push(`Target schema v${targetVersion} is already active or lower.`);
        report.dryRunPassed = true;
        return report;
      }

      // In-memory simulation
      const clonedSnapshot = this.captureCurrentStorageSnapshot();
      let recordCount = 0;
      Object.keys(clonedSnapshot).forEach(k => {
        if (clonedSnapshot[k]) {
          try {
            const parsed = JSON.parse(clonedSnapshot[k]);
            if (Array.isArray(parsed)) recordCount += parsed.length;
            else if (typeof parsed === 'object') recordCount += Object.keys(parsed).length;
          } catch (e) {}
        }
      });
      report.recordsInspected = recordCount;

      // Sequential migration check
      let stepVer = currentVer;
      while (stepVer < targetVersion) {
        if (!MIGRATION_REGISTRY[stepVer]) {
          report.errors.push(`Missing sequential migration handler for v${stepVer} -> v${stepVer + 1}.`);
          break;
        }
        report.expectedChanges.push(`Simulated migration step v${stepVer} -> v${stepVer + 1}`);
        stepVer++;
      }

      if (report.errors.length === 0) {
        report.dryRunPassed = true;
      }

      return report;
    }

    async executeMigration(targetVersion) {
      let meta = this.initSchemaMetadata();
      const fromVersion = meta.schemaVersion;

      if (targetVersion <= fromVersion) {
        return { success: true, message: 'Already up to date.' };
      }

      const preCheck = this.validatePreMigration(meta, targetVersion);
      if (!preCheck.valid) {
        return { success: false, errors: preCheck.errors };
      }

      const migrationId = 'mig_' + Date.now();

      // State: PREPARING
      meta.migrationState = MIGRATION_STATES.PREPARING;
      meta.migrationId = migrationId;
      meta.fromVersion = fromVersion;
      meta.toVersion = targetVersion;
      meta.startedAt = new Date().toISOString();
      this.setMetadata(meta);

      // Create Recovery Snapshot
      const recoverySnapshot = await this.createRecoverySnapshot(fromVersion, targetVersion);

      // State: RUNNING
      meta.migrationState = MIGRATION_STATES.RUNNING;
      this.setMetadata(meta);

      try {
        let currentVer = fromVersion;
        while (currentVer < targetVersion) {
          const handler = MIGRATION_REGISTRY[currentVer];
          if (!handler) {
            throw new Error(`Migration path v${currentVer} -> v${currentVer + 1} not registered.`);
          }

          const currentPayload = this.captureCurrentStorageSnapshot();
          const transformedPayload = await handler(currentPayload);

          // Write transformed payload idempotently
          Object.keys(transformedPayload).forEach(key => {
            if (transformedPayload[key] !== undefined && transformedPayload[key] !== null) {
              this.storage.setItem(key, typeof transformedPayload[key] === 'string' ? transformedPayload[key] : JSON.stringify(transformedPayload[key]));
            }
          });

          currentVer++;
        }

        // State: VALIDATING
        meta.migrationState = MIGRATION_STATES.VALIDATING;
        this.setMetadata(meta);

        const postSnapshot = this.captureCurrentStorageSnapshot();
        const postCheck = this.validatePostMigration(recoverySnapshot.data, postSnapshot);

        if (!postCheck.valid) {
          throw new Error('Post-migration validation failed: ' + postCheck.errors.join('; '));
        }

        // State: COMPLETED
        meta.schemaVersion = targetVersion;
        meta.migrationState = MIGRATION_STATES.COMPLETED;
        meta.lastMigrationAt = new Date().toISOString();
        meta.errorCode = null;
        this.setMetadata(meta);

        return { success: true, schemaVersion: targetVersion };

      } catch (err) {
        // Rollback
        meta.migrationState = MIGRATION_STATES.FAILED;
        meta.failedAt = new Date().toISOString();
        meta.errorCode = err.message || 'Unknown migration error';
        this.setMetadata(meta);

        const rollbackResult = await this.rollback(recoverySnapshot);
        return { success: false, error: err.message, rolledBack: rollbackResult.success };
      }
    }

    async rollback(recoverySnapshotRecord = null) {
      let snapshot = recoverySnapshotRecord;
      if (!snapshot && this.storage) {
        try {
          const raw = this.storage.getItem(RECOVERY_SNAPSHOT_KEY);
          snapshot = raw ? JSON.parse(raw) : null;
        } catch (e) {}
      }

      if (!snapshot) {
        return { success: false, error: 'No recovery snapshot available for rollback.' };
      }

      const snapCheck = await this.validateRecoverySnapshot(snapshot);
      if (!snapCheck.valid) {
        return { success: false, error: snapCheck.error };
      }

      // Restore data from snapshot
      Object.keys(snapshot.data).forEach(key => {
        if (snapshot.data[key] !== null && snapshot.data[key] !== undefined) {
          this.storage.setItem(key, snapshot.data[key]);
        }
      });

      // Update metadata state to ROLLED_BACK
      let meta = this.getMetadata();
      if (meta) {
        meta.schemaVersion = snapshot.fromVersion;
        meta.migrationState = MIGRATION_STATES.ROLLED_BACK;
        this.setMetadata(meta);
      }

      return { success: true, restoredVersion: snapshot.fromVersion };
    }

    async handleStartupRecovery() {
      let meta = this.initSchemaMetadata();
      if (!meta) return { status: 'ok' };

      const state = meta.migrationState;

      if (state === MIGRATION_STATES.IDLE || state === MIGRATION_STATES.COMPLETED) {
        return { status: 'ok', schemaVersion: meta.schemaVersion };
      }

      if (state === MIGRATION_STATES.RUNNING || state === MIGRATION_STATES.PREPARING || state === MIGRATION_STATES.VALIDATING) {
        // Interrupted session detected: execute rollback safely to restore clean state
        const rb = await this.rollback();
        return { status: 'interrupted_rollback', success: rb.success };
      }

      if (state === MIGRATION_STATES.FAILED || state === MIGRATION_STATES.ROLLED_BACK) {
        return { status: 'diagnostic_attention', errorCode: meta.errorCode };
      }

      return { status: 'ok' };
    }
  }

  // Export module
  const serviceInstance = new MigrationService();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MigrationService, MIGRATION_STATES, MIGRATION_REGISTRY, APP_SCHEMA_VERSION, APP_VERSION, SCHEMA_METADATA_KEY, RECOVERY_SNAPSHOT_KEY };
  } else {
    global.MigrationService = MigrationService;
    global.migrationService = serviceInstance;
  }

})(typeof window !== 'undefined' ? window : global);
