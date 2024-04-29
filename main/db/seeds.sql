-- Seeds for departments
INSERT INTO department (name)
VALUES
    ("Executive"),
    ("Sales"),
    ("Marketing"),
    ("Operations");

-- Seeds for roles
INSERT INTO role (title, salary, department_id)
VALUES
    ("CEO", 1000000.00, 1),
    ("Sales Manager", 150000.00, 2),
    ("Marketing Manager", 100000.00, 3),
    ("Operations Manager", 200000.00, 4),
    ("Assistant Sales Manager", 120000.00, 2),
    ("Assistant Marketing Manager", 70000.00, 3),
    ("Assistant Operations Manager", 170000.00, 4);

-- Seeds for employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Alice", "Walker", 1, 1),
    ("Taylor", "Smith", 2, 1),
    ("Ashley", "Johnson", 3, 1),
    ("Julie", "Watkins", 4, 1),
    ("Megan", "Campbell", 5, 2),
    ("Olivia", "Rogers", 6, 3),
    ("Danielle", "Jones", 7, 4);