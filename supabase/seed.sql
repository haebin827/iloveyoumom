-- Customer Mock Data
-- This file includes random mock datas

BEGIN;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '김민지', '01012345678', 'M', '28', '슬림', '캐주얼', '베이지', '1995-03-15', '형광색', '키가 크고 날씬함', '아메리카노', '2024-01-15', '여성', 3
from auth.users u
where u.email = 'haebin.noh@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '박지혜', '01023456789', 'L', '30', '보통', '페미닌', '파스텔', '1992-07-22', '검정', '어깨가 넓음', '라떼', '2024-01-20', '여성', 5
from auth.users u
where u.email = 'haebin.noh@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '이서연', '01034567890', 'S', '26', '마른', '미니멀', '화이트', '1998-11-03', '빨강', '작고 귀여운 체형', '녹차라떼', '2024-02-01', '여성', 2
from auth.users u
where u.email = 'haebin.noh@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '최유진', '01045678901', 'M', '29', '통통', '로맨틱', '핑크', '1994-05-18', '노랑', '동그란 체형', '바닐라라떼', '2024-02-05', '여성', 4
from auth.users u
where u.email = 'haebin.noh@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '장혜림', '01056789012', 'L', '32', '슬림', '시크', '블랙', '1991-09-12', '오렌지', '키 크고 모델 체형', '에스프레소', '2024-02-10', '여성', 6
from auth.users u
where u.email = 'haebin.noh@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '윤서희', '01067890123', 'S', '25', '보통', '스포티', '네이비', '1999-01-27', '보라', '운동선수 체형', '디카페인', '2024-02-15', '여성', 1
from auth.users u
where u.email = 'haebin.noh@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '신예은', '01078901234', 'M', '28', '마른', '빈티지', '브라운', '1996-08-09', '형광핑크', '빈티지 스타일 선호', '카페모카', '2024-02-20', '여성', 3
from auth.users u
where u.email = 'haebin.noh@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '강다은', '01089012345', 'L', '31', '통통', '클래식', '그레이', '1993-12-14', '금색', '우아한 스타일', '카푸치노', '2024-02-25', '여성', 5
from auth.users u
where u.email = 'haebin.noh@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '조미현', '01090123456', 'S', '27', '슬림', '모던', '실버', '1997-04-06', '네온컬러', '세련된 도시 스타일', '플랫화이트', '2024-03-01', '여성', 2
from auth.users u
where u.email = 'haebin.noh@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '한소영', '01001234567', 'M', '29', '보통', '보헤미안', '카키', '1995-10-21', '핫핑크', '자유분방한 스타일', '허브티', '2024-03-05', '여성', 4
from auth.users u
where u.email = 'haebin.noh@gmail.com'
on conflict (phone) do nothing;

-- Insert customers for nhb0702@gmail.com (10 customers)
insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '배수진', '01013572468', 'L', '33', '마른', '엘레가스', '와인', '1990-06-13', '라임', '고급스러운 취향', '마키아토', '2024-03-10', '여성', 7
from auth.users u
where u.email = 'nhb0702@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '노지현', '01024681357', 'S', '26', '통통', '걸리시', '빨강', '1998-02-28', '민트', '개성있는 스타일', '콜드브루', '2024-03-15', '여성', 1
from auth.users u
where u.email = 'nhb0702@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '송하늘', '01036914702', 'M', '28', '슬림', '내추럴', '아이보리', '1996-09-17', '형광녹색', '자연스러운 분위기', '오렌지주스', '2024-03-20', '여성', 3
from auth.users u
where u.email = 'nhb0702@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '안지우', '01047023691', 'L', '30', '보통', '프레피', '체크', '1994-11-08', '보라', '대학생 스타일', '레모네이드', '2024-03-25', '여성', 5
from auth.users u
where u.email = 'nhb0702@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '임채영', '01058136924', 'S', '25', '마른', '힐스터', '데님', '1999-07-04', '애시드컬러', '독특한 개성', '차이티', '2024-04-01', '여성', 2
from auth.users u
where u.email = 'nhb0702@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '유가영', '01069245813', 'M', '29', '통통', '글람', '골드', '1995-01-19', '네온노랑', '화려한 스타일', '샴페인', '2024-04-05', '여성', 4
from auth.users u
where u.email = 'nhb0702@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '정수빈', '01070358146', 'L', '32', '슬림', '미니멀시크', '모노톤', '1992-05-26', '무지개색', '깔끔한 스타일', '얼그레이', '2024-04-10', '여성', 6
from auth.users u
where u.email = 'nhb0702@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '홍예린', '01081467035', 'S', '27', '보통', '러블리', '라벤더', '1997-12-11', '다크컬러', '사랑스러운 분위기', '딸기라떼', '2024-04-15', '여성', 1
from auth.users u
where u.email = 'nhb0702@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '문지영', '01092570368', 'M', '28', '마른', '아및가르드', '블랙화이트', '1996-03-30', '형광오렌지', '예술적 감각', '더치커피', '2024-04-20', '여성', 3
from auth.users u
where u.email = 'nhb0702@gmail.com'
on conflict (phone) do nothing;

insert into public.customer (user_id, name, phone, top_size, bottom_size, body_type, style_prefer, color_prefer, birth, color_avoid, note, drink_prefer, first_visit, gender, visit_count)
select u.id, '구혜진', '01003689257', 'L', '31', '통통', '컨트리', '체크패턴', '1993-08-07', '네온그린', '시골 스타일', '사과주스', '2024-04-25', '여성', 5
from auth.users u
where u.email = 'nhb0702@gmail.com'
on conflict (phone) do nothing;

COMMIT;