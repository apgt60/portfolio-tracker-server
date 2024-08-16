CREATE TABLE "ping" (
	"id" serial NOT NULL,
	"description" varchar(250) NOT NULL,
	"time" TIMESTAMP NOT NULL,
	CONSTRAINT "File_pk" PRIMARY KEY ("id")
);

CREATE TABLE "appuser" (
	"id" serial NOT NULL,
	"username" varchar(20) UNIQUE NOT NULL,
	"passhash" varchar(500) NOT NULL,
	"created" TIMESTAMP NOT NULL,
	"firstname" varchar(50) NOT NULL,
	"lastname" varchar(50) NOT NULL,
	CONSTRAINT "User_pk" PRIMARY KEY ("id")
);

CREATE TABLE "stockwatch" (
	"id" serial NOT NULL,
	"ticker" varchar(50) NOT NULL,
	"appuser_id" integer NOT NULL,
	"count" float,
	"cost" float NOT NULL,
	"created" TIMESTAMP NOT NULL,
	CONSTRAINT "Stockwatch_pk" PRIMARY KEY ("id")
);

ALTER TABLE "appuser" ADD "guid" varchar(36) UNIQUE NOT NULL;
ALTER TABLE "stockwatch" ADD "guid" varchar(36) UNIQUE NOT NULL;
ALTER TABLE "appuser" ADD "email" varchar(50) UNIQUE NOT NULL;
ALTER TABLE "appuser" DROP COLUMN "username";

CREATE TABLE "nyse_stocks" (
	"id" serial NOT NULL,
	"ticker" varchar(10) NOT NULL,
	"name" varchar(250) NOT NULL,
	CONSTRAINT "Nyse_stocks_pk" PRIMARY KEY ("id")
);


