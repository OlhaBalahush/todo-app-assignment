-- Update the done column to status column with enum values
ALTER TABLE todos DROP COLUMN done;
ALTER TABLE todos ADD COLUMN status VARCHAR(20) DEFAULT 'TODO';
UPDATE todos SET status = 'TODO' WHERE status IS NULL;
