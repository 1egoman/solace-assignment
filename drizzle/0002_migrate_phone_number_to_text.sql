alter table "advocates" add column "phone_number_text" text;

-- Do a data migration into the new text version of the field
--
-- NOTE: If this was a real database with certain uptime guarantees, I'd probably do something
-- more nuanced than this to avoid inadvertant locking issues.
-- Also, I'm going to assume that app phone numbers are all perfectly formatted US 10 digit phone
-- numbers, but in practice there'd probably need to be some phone number parsing library in play.
update "advocates" set "phone_number_text" = concat(
  '+1 (',
  substring("phone_number"::text, 0, 4),
  ') ',
  substring("phone_number"::text, 4, 3),
  '-',
  substring("phone_number"::text, 7)
);

-- In a real production migration, this would probably be multi-step so that the app would never go
-- down throughout the whole processs, but I'm going to skip that for now.

alter table "advocates" drop column "phone_number";
alter table "advocates" rename column "phone_number_text" to "phone_number";
