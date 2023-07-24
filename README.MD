[Задание](https://drive.google.com/file/d/17L5RXm1DeM51PCEkD9CXt75QnOfENbfn/view?usp=sharing)

Перед запуском контейнеров НУЖНО заполнить .env

Для запуска контейнеров ``docker-compose docker-compose.yml up -d``

HTTP обрабатывает только один запрос 
* (тело должно содержать json, с полем ``test`` для успешного выполнения. При отсутствии будет возвращена ошибка)

  `curl --location 'http://127.0.0.1:3000/test_task' \
  --header 'Content-Type: application/json' \
  --data '{
  "test":"Test"
  }'`
