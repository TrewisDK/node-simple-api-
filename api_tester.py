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
    'task_name' : "send SQL enjaction",
    'task_text': "xD"
}

data_show = {
    'login': "b69e30a7c4654", 
    'password' : "test12341"
}
#print(requests.post("http://127.0.0.1:3000/create_task", data=data_login))
print(requests.get("http://127.0.0.1:3000/show_tasks?login=b69e30a7c4654&password=test12341").json())
