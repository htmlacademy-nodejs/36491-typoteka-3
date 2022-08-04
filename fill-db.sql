
          INSERT INTO users(email, password_hash, first_name, last_name, avatar, role) VALUES ('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg', '123'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg', '321');
          INSERT INTO categories(name) VALUES ('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо');

          ALTER TABLE articles DISABLE TRIGGER ALL;
          INSERT INTO articles(title, announcement, text, photo, user_id) VALUES ('Что такое золотое сечение', '', 'Из под его пера вышло 8 платиновых альбомов.', 'picture.jpg', '1'),
('Что такое золотое сечение', 'Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Он написал больше 30 хитов.', 'Первая большая ёлка была установлена только в 1938 году.', 'picture.jpg', '1');
          ALTER TABLE articles ENABLE TRIGGER ALL;

          ALTER TABLE article_categories DISABLE TRIGGER ALL;
          INSERT INTO article_categories(article_id, category_id) VALUES ('1', '1'),
('2', '5');
          ALTER TABLE article_categories ENABLE TRIGGER ALL;

          ALTER TABLE article_comments DISABLE TRIGGER ALL;
          INSERT INTO article_comments(article_id, comment_id) VALUES ('1', '1'),
('2', '2');
          ALTER TABLE article_comments ENABLE TRIGGER ALL;

          ALTER TABLE user_articles DISABLE TRIGGER ALL;
          INSERT INTO user_articles(user_id, article_id) VALUES ('1', '1'),
('1', '2');
          ALTER TABLE user_articles ENABLE TRIGGER ALL;

          ALTER TABLE user_comments DISABLE TRIGGER ALL;
          INSERT INTO user_comments(user_id, comment_id) VALUES ('1', '1'),
('2', '2'),
('2', '3'),
('2', '4'),
('2', '5');
          ALTER TABLE user_comments ENABLE TRIGGER ALL;

          ALTER TABLE comments DISABLE TRIGGER ALL;
          INSERT INTO COMMENTS(text, user_id, article_id) VALUES ('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?', '1', '1'),
('Совсем немного...', '2', '2'),
('Это где ж такие красоты? Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', '2', '2'),
('Планируете записать видосик на эту тему? Совсем немного...', '2', '2'),
('Согласен с автором!', '2', '2');
          ALTER TABLE comments ENABLE TRIGGER ALL;