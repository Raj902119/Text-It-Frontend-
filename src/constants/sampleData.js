export const sampleChats = [
    {
        avatar:['../../profileW.jpg'],
        name: "Raj Patil",
        _id: "1",
        groupChat: false,
        members:["1","2"],
    },
    {
        avatar:['../../profileM.jpg'],
        name: "Rajwardhan",
        _id: "2",
        groupChat: false,
        members:["1","2"],
    },
];

export const sampleUsers =[{
    avatar:"../../profileW.jpg",
    name:"Raj Patil",
    _id:"1"
},{
    avatar:"../../profileM.jpg",
    name:"Rajwardhan",
    _id:"2"
}]

export const sampleNotifications = [
    {
        sender: {
            avatar:"../../profileW.jpg",
            name:"Raj Patil"
        },
        _id: "1",
    },
    {
        sender: {
            avatar:"../../profileM.jpg",
            name:"Rajwardhan"
        },
        _id: "2",
    }

]

export const sampleMessage = [
    {
        attachments: [],
        content: "I Want You",
        _id: "sdasfsafsjahjfiasdjfjsa",
        sender: {
            _id: "user._id",
            name: "Chaman",
        },
        chat: "chatId",
        createdAt: "2024-03-23T10:41:30.630Z",
    },
    {
        attachments: [{
            public_id:"asdsdsd",
            url: "https://www.w3schools.com/howto/img_avatar.png",
        }],
        content: "",
        _id: "sdasfsafsjahjfiasdjfjsa",
        sender: {
            _id: "sdsfjsd",
            name: "Chaman 2",
        },
        chat: "chatId",
        createdAt: "2024-03-23T10:41:30.630Z",
    }
];

export const dashboardData = {
    users: [
        {
            name: "Raj Patil",
            avatar: '../../profileW.jpg',
            _id: "1",
            username: "Baku",
            friends: 20,
            groups: 5,
        },
        {
            name: "Pratik Patil",
            avatar: '../../profileM.jpg',
            _id: "2",
            username: "Baba",
            friends: 20,
            groups: 25,
        }
    ],

    chats: [
        {
            name: "Raj Patil",
            avatar: ['../../profileW.jpg'],
            _id: "1",
            groupChat: false,
            members: [{_id: "1",avatar: '../../profileW.jpg'},{_id: "2",avatar: '../../profileM.jpg'}],
            totalMembers: 2,
            totalMessages: 20,
            creator: {
                name: "Raja",
                avatar: '../../profileM.jpg',
            }
        },
        {
            name: "Pratik Patil",
            avatar: ['../../profileM.jpg'],
            _id: "2",
            groupChat: true,
            members: [{_id: "1",avatar: '../../profileW.jpg'},{_id: "1",avatar: '../../profileW.jpg'}],
            totalMembers: 2,
            totalMessages: 20,
            creator: {
                name: "Baba",
                avatar: '../../profileW.jpg',
            }
        }
    ],
    
    messages: [
        {
            attachments: [],
            content: "I Want You",
            _id: "sdasfsafsjahjfiasdjfjsa",
            sender: {
                avatar: '../../profileW.jpg',
                name: "Chaman",
            },
            chat: "chatId",
            groupChat: false,
            createdAt: "2024-03-23T10:41:30.630Z",
        },
        {
            attachments: [{
                public_id:"asdsdsd",
                url: "https://www.w3schools.com/howto/img_avatar.png",
            }],
            content: "",
            _id: "sdasfsafsjahjfiasdjfjsa",
            sender: {
                avatar: '../../profileM.jpg',
                name: "Chaman 2",
            },
            chat: "chatId",
            groupChat: true,
            createdAt: "2024-03-23T10:41:30.630Z",
        }
    ]
}