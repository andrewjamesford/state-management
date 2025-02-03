BEGIN TRANSACTION;
CREATE TABLE categories (
	id SERIAL PRIMARY KEY,
	category_name TEXT,
	parent_id INT,
	active BOOLEAN
);
CREATE TABLE listings (
	id SERIAL PRIMARY KEY,
	title varchar(80),
	category_id INT,
	sub_title varchar(50),
	end_date timeStamp,
	listing_description text,
	condition_new boolean,
	listing_price double,
	reserve_price double,
	credit_card_payment boolean,
	bank_transfer_payment boolean,
	bitcoin_payment boolean,
	pick_up boolean,
	shipping_option varchar(30)
);
COMMIT;