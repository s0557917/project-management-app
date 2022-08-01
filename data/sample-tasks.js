const sampleData = [
    {
        "id": "5529eacc-9376-4115-badb-f1b8163ae100",    
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
        "subtasks": [
            "b4c63d1b-3bf8-4a63-9e3f-28b0918f668b", 
            "7a3f7529-13ff-42ae-b4b0-6056f2526a3e",
        ]
    },
    {
        "id": "b4c63d1b-3bf8-4a63-9e3f-28b0918f668b",    
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
        "id": "7a3f7529-13ff-42ae-b4b0-6056f2526a3e",    
        "title": "Third Task",
        "details": "Two imprisoned",
        "completed": false,
        "dueDate": "01/01/2020",
        "priority": 5,
        "category": "Personal",
        "reminders": [],
        "subtasks": [ "2200df4b-cd1d-4f35-bd61-38d4c8cae1a3" ]
    },
    {
        "id": "2200df4b-cd1d-4f35-bd61-38d4c8cae1a3",    
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