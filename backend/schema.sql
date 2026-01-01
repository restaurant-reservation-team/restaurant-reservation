USE restaurant_reservation;




-- TABLES (NEW)
CREATE TABLE IF NOT EXISTS tables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  seats INT NOT NULL,
  zone VARCHAR(50) DEFAULT NULL,

  shape ENUM('rect','circle') NOT NULL DEFAULT 'rect',
  x INT NOT NULL DEFAULT 0,
  y INT NOT NULL DEFAULT 0,
  w INT DEFAULT 90,
  h INT DEFAULT 70,
  r INT DEFAULT 36,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RESERVATIONS (FINAL, NO LOGIN)
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,

  table_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(50) NOT NULL,

  people INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,

  duration_minutes INT NOT NULL DEFAULT 90,
  status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',

  message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_res_table
    FOREIGN KEY (table_id) REFERENCES tables(id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,

  CONSTRAINT chk_people_positive CHECK (people > 0),
  CONSTRAINT chk_duration_positive CHECK (duration_minutes > 0)
);


CREATE INDEX idx_res_date_time ON reservations(date, time);
CREATE INDEX idx_res_table_date ON reservations(table_id, date);

-- GALLERY
CREATE TABLE IF NOT EXISTS gallery_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
