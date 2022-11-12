/**
 * @file internal_db.sql
 * 
 * @brief Creates the internal database for the online store.
 * 
 * @author
 * @author 
 * @author
 * @author
 * 
 * CSCI 467 - 1
 */
 
DROP TABLE IF EXISTS Carts_467, Orders_467, Customers_467, Products_467, Employees_467;


-- Employees table
CREATE TABLE Employees_467(
    EmpID    CHAR(8)   NOT NULL, -- Employees ID for each employee (8 char max)
    Name     CHAR(255) NOT NULL, -- Employees Name
    Password CHAR(255) NOT NULL, -- Password for Employee login (8 char min)
    EmpType     INTEGER   NOT NULL, -- Type of Employee 

    PRIMARY KEY(EmpID)           -- Sets the primary key (EmpID)
);


-- Products table
CREATE TABLE Products_467(
    ProductID   INTEGER   AUTO_INCREMENT, -- Product ID for each product
    Quantity    INTEGER   NOT NULL,       -- Quantity of the product in stock

    PRIMARY KEY(ProductID)                -- Sets the primary key (ProductID)
);


-- Customers table
CREATE TABLE Customers_467(
    Username CHAR(15)  NOT NULL,  -- Customers username (15 char max)
    Password CHAR(255) NOT NULL,  -- Password for customers login (8 char min)
    Name     CHAR(255) NOT NULL,  -- Customers name
    Email    CHAR(255) NOT NULL,  -- Customers email

    PRIMARY KEY(Username)         -- Sets the primary key (Username)
);


-- Orders table
CREATE TABLE Orders_467(
    OrderID     INTEGER  AUTO_INCREMENT,                  -- Order number for each order
    EmpID       CHAR(8),                                  -- Employee assigned to process order
    Username    CHAR(15) NOT NULL,                        -- Customer that made the order
    Total       DOUBLE,                                   -- The total of the order
    Status      INTEGER  DEFAULT 1,                       -- Status of order (1 = in cart (default), 2 = received, 3 = processed)
    TrackingNum INTEGER,                                  -- Tracking number of order, initially null untill shipped
    Notes       CHAR(255),                                -- Notes for order, intially null
    Address     CHAR(255),                                -- Address where the order should be shipped, null untill order is placed

    PRIMARY KEY(OrderID),                                 -- Sets the primary key (OrderID)
    FOREIGN KEY(EmpID)    REFERENCES Employees_467(EmpID),    -- Sets the foreign key from Employees table
    FOREIGN KEY(Username) REFERENCES Customers_467(Username)  -- Sets the foreign key from Customers table
) AUTO_INCREMENT = 1252;                                  -- Starts to increment from specified value


-- Shopping Carts table
CREATE TABLE Carts_467(
    OrderID   INTEGER NOT NULL,                            -- Order number for each order
    ProductID INTEGER NOT NULL,                            -- Product ID for each product
    Username  CHAR(15) NOT NULL,                           -- Customers username
    Amount    INTEGER NOT NULL,                            -- Amount of the product to be placed in the cart for the specific customer

    PRIMARY KEY(OrderID, ProductID),                       -- Sets the primary key (OrderID, ProductID)
    FOREIGN KEY(ProductID) REFERENCES Products_467(ProductID), -- Sets the foreign key from Products table
    FOREIGN KEY(OrderID)   REFERENCES Orders_467(OrderID),     -- Sets the foreign key from Orders table
    FOREIGN KEY(Username)  REFERENCES Customers_467(Username)  -- Sets the foreign key from Customers table
);