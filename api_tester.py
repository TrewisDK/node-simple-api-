import requests


data_create = {
    "username": "tester",
    "email": "stepbash124@gmail.com",
    "password": "test12341",
    "confirm_password": "test12341"
}

data_login = {
    'login': "b69e30a7c4654", 
    'password' : "test12341",
    'task_name' : "learn_nodejs",
    'task_text': "Learn node.js it's realy GOOD idea"
}

print(requests.post("http://127.0.0.1:3000/create_task", data=data_login).json())
