-- Custom SQL migration file, put you code below! --

insert into specialities(label) select distinct speciality from advocates on conflict do nothing;
