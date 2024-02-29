CREATE TABLE "ping" (
	"id" serial NOT NULL,
	"description" varchar(250) NOT NULL,
	"time" TIMESTAMP,
	CONSTRAINT "File_pk" PRIMARY KEY ("id")
);

CREATE TABLE "appuser" (
	"id" serial NOT NULL,
	"username" varchar(20) UNIQUE NOT NULL,
	"passhash" varchar(500) NOT NULL,
	"created" TIMESTAMP,
	CONSTRAINT "User_pk" PRIMARY KEY ("id")
);

CREATE TABLE "stockwatch" (
	"id" serial NOT NULL,
	"ticker" varchar(50) NOT NULL,
	"appuser_id" integer NOT NULL,
	"count" float,
	"cost" float NOT NULL,
	"created" TIMESTAMP,
	CONSTRAINT "Stockwatch_pk" PRIMARY KEY ("id")
);




