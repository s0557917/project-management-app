const sampleData = [
    {
        "id": "1",    
        "title": "The Shawshank Redemption",
        "details": "Two imprisoned",
        "completed": false,
        "dueDate": "01/01/2020",
        "priority": 5,
        "category": "Personal",
        "reminders": [
            {
                "date": "01/01/2020",
                "time": "12:00"
            },
            {
                "date": "01/01/2020",
                "time": "12:00"
            }
        ],
        "subtasks": [2, 3]
    },
    {
        "id": "2",    
        "title": "Second Task",
        "details": "Two imprisoned",
        "completed": true,
        "dueDate": "01/01/2020",
        "priority": 5,
        "category": "Personal",
        "reminders": [
            {
                "date": "01/01/2020",
                "time": "12:00"
            },
            {
                "date": "01/01/2020",
                "time": "12:00"
            }
        ],
        "subtasks": []
    },
    {
        "id": "3",    
        "title": "Third Task",
        "details": "Two imprisoned",
        "completed": false,
        "dueDate": "01/01/2020",
        "priority": 5,
        "category": "Personal",
        "reminders": [],
        "subtasks": [4]
    },
    {
        "id": "4",    
        "title": "Fourth Task",
        "details": "Two imprisoned",
        "completed": true,
        "dueDate": "01/01/2020",
        "priority": 5,
        "category": "Personal",
        "reminders": [
            {
                "date": "01/01/2020",
                "time": "12:00"
            }
        ],
        "subtasks": []
    }
]

export default sampleData;