-- Test data for Todo Application
-- This file contains sample todos and subtasks for testing purposes

-- Insert main todos (created_at will be automatically set by database default)
INSERT INTO todos (description, due_date, status) VALUES
('Plan vacation to Japan', '2025-11-15 00:00:00', 'TODO'),
('Complete project documentation', '2025-10-20 17:00:00', 'DONE'),
('Learn React hooks', '2025-11-25 00:00:00', 'TODO'),
('Organize home office', '2025-10-18 00:00:00', 'TODO'),
('Prepare for job interview', '2025-11-22 14:00:00', 'TODO'),
('Read Clean Code book', '2025-11-10 00:00:00', 'DONE'),
('Setup CI/CD pipeline', '2025-11-30 00:00:00', 'TODO'),
('Plan birthday party', '2025-11-10 00:00:00', 'TODO'),
('Fix bug in authentication', '2025-10-19 00:00:00', 'DONE'),
('Create user manual', '2025-11-05 00:00:00', 'TODO');

-- Insert subtasks for vacation planning
INSERT INTO todos (description, due_date, status, parent_id) VALUES
('Book flights', '2025-10-20 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Plan vacation to Japan' LIMIT 1)),
('Reserve hotels', '2025-10-25 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Plan vacation to Japan' LIMIT 1)),
('Create itinerary', '2025-11-10 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Plan vacation to Japan' LIMIT 1)),
('Apply for visa', '2025-10-15 00:00:00', 'DONE', (SELECT id FROM todos WHERE description = 'Plan vacation to Japan' LIMIT 1));

-- Insert subtasks for project documentation
INSERT INTO todos (description, due_date, status, parent_id) VALUES
('Write API documentation', '2025-10-15 00:00:00', 'DONE', (SELECT id FROM todos WHERE description = 'Complete project documentation' LIMIT 1)),
('Create user guide', '2025-10-18 00:00:00', 'DONE', (SELECT id FROM todos WHERE description = 'Complete project documentation' LIMIT 1)),
('Document deployment process', '2025-10-20 00:00:00', 'DONE', (SELECT id FROM todos WHERE description = 'Complete project documentation' LIMIT 1));

-- Insert subtasks for React learning
INSERT INTO todos (description, due_date, status, parent_id) VALUES
('Study useState hook', '2025-10-10 00:00:00', 'DONE', (SELECT id FROM todos WHERE description = 'Learn React hooks' LIMIT 1)),
('Practice useEffect hook', '2025-10-15 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Learn React hooks' LIMIT 1)),
('Learn custom hooks', '2025-11-25 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Learn React hooks' LIMIT 1));

-- Insert subtasks for home office organization
INSERT INTO todos (description, due_date, status, parent_id) VALUES
('Clean desk area', '2025-10-10 00:00:00', 'DONE', (SELECT id FROM todos WHERE description = 'Organize home office' LIMIT 1)),
('Organize cables', '2025-10-12 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Organize home office' LIMIT 1)),
('Setup monitor stand', '2025-10-15 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Organize home office' LIMIT 1));

-- Insert subtasks for job interview preparation
INSERT INTO todos (description, due_date, status, parent_id) VALUES
('Research company background', '2025-10-15 00:00:00', 'DONE', (SELECT id FROM todos WHERE description = 'Prepare for job interview' LIMIT 1)),
('Practice coding problems', '2025-10-20 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Prepare for job interview' LIMIT 1)),
('Prepare questions to ask', '2025-11-22 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Prepare for job interview' LIMIT 1));

-- Insert subtasks for CI/CD setup
INSERT INTO todos (description, due_date, status, parent_id) VALUES
('Configure GitHub Actions', '2025-10-20 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Setup CI/CD pipeline' LIMIT 1)),
('Setup automated testing', '2025-10-25 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Setup CI/CD pipeline' LIMIT 1)),
('Configure deployment pipeline', '2025-11-30 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Setup CI/CD pipeline' LIMIT 1));

-- Insert subtasks for birthday party planning
INSERT INTO todos (description, due_date, status, parent_id) VALUES
('Send invitations', '2025-10-25 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Plan birthday party' LIMIT 1)),
('Order cake', '2025-11-05 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Plan birthday party' LIMIT 1)),
('Plan activities', '2025-11-08 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Plan birthday party' LIMIT 1));

-- Insert subtasks for user manual creation
INSERT INTO todos (description, due_date, status, parent_id) VALUES
('Write installation guide', '2025-10-25 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Create user manual' LIMIT 1)),
('Create feature documentation', '2025-10-30 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Create user manual' LIMIT 1)),
('Add screenshots', '2025-11-03 00:00:00', 'TODO', (SELECT id FROM todos WHERE description = 'Create user manual' LIMIT 1));

