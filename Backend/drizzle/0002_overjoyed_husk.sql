CREATE TABLE "projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"name" varchar(255) DEFAULT 'Project' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rules" DROP CONSTRAINT "rules_url_id_urls_id_fk";
--> statement-breakpoint
ALTER TABLE "rules" DROP CONSTRAINT "rules_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "urls" DROP CONSTRAINT "urls_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "urls" DROP CONSTRAINT "urls_rules_id_rules_id_fk";
--> statement-breakpoint
ALTER TABLE "rules" ADD COLUMN "project_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "rules" ADD COLUMN "version" varchar(255) DEFAULT 'v1' NOT NULL;--> statement-breakpoint
ALTER TABLE "urls" ADD COLUMN "project_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(255) DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "rules" ADD CONSTRAINT "rules_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rules" ADD CONSTRAINT "rules_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "urls" ADD CONSTRAINT "urls_rules_id_rules_id_fk" FOREIGN KEY ("rules_id") REFERENCES "public"."rules"("id") ON DELETE cascade ON UPDATE no action;