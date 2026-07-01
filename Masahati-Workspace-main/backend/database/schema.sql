-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user','owner','admin') NOT NULL DEFAULT 'user',
    avatar VARCHAR(255) DEFAULT 'avatar.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE workspaces (
    id INT AUTO_INCREMENT PRIMARY KEY,

    owner_id INT NOT NULL,

    workspace_name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    city VARCHAR(100) NOT NULL,
    area VARCHAR(100) NOT NULL,

    internet_quality ENUM('Very Fast', 'Fast', 'Good'),
    electricity_status ENUM('Available', '24/7', 'Backup Available'),

    seating INT NULL,

    hours_from TIME,
    hours_to TIME,

    quietness_level ENUM('very_quiet','quiet','normal'),

    ladies_area BOOLEAN DEFAULT 0,

    price_per_hour DECIMAL(10,2),

    whatsapp VARCHAR(20),

    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    approved_at TIMESTAMP NULL DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    KEY idx_city (city),
    KEY idx_area (area),
    KEY idx_status (status),
    KEY idx_price (price_per_hour),
    KEY idx_owner (owner_id),

    FOREIGN KEY (owner_id) REFERENCES users(id)
        ON DELETE CASCADE
);
CREATE TABLE workspace_images (
    id INT AUTO_INCREMENT PRIMARY KEY,

    workspace_id INT NOT NULL,

    image_path VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_workspace_images_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE
);

CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workspace_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_favorite (user_id, workspace_id),

    KEY idx_user (user_id),
    KEY idx_workspace (workspace_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    workspace_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY unique_review (user_id, workspace_id),

    KEY idx_user (user_id),
    KEY idx_workspace (workspace_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE
);