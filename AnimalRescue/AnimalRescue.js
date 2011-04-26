var game = { // temporary to allow inclusion as a script, eventually from the db
    name: 'Animal Letter Rescue',
    intro: "The animals need your help! Some need to be rescued and others must be captured. Help the animals by making the first letter of their names. Listen carefully as we find each escaped animal.",
    words: [
        {   word: "Alligator",
            intro: "An alligator has escaped from the swamp! Help capture it and return it to the swamp!",
            success: "You have captured the alligator and it is back in the swamp.",
            image: "AnimalRescue/Images/alligator.jpg",
            sound: "AnimalRescue/Sounds/alligator"
        },
        {   word: "Bear",
            intro: "There is a grizzly bear out in the wild that needs to be captured! Help capture the bear by making the first letter of bear.",
            success: "Yes! You have captured the bear.",
            image: "AnimalRescue/Images/bear.jpg",
            sound: "AnimalRescue/Sounds/bear"
        },
        {   word: "Cat",
            intro: "Your neighbor's cat is missing! To help your neighbor find her cat you must make the first letter of the word cat.",
            success: "Good job! you found the cat on the street and have returned it to your neighbor.",
            image: "AnimalRescue/Images/cat.jpg",
            sound: "AnimalRescue/Sounds/cat"
        },
        {   word: "Dog",
            intro: "Your dog broke away from its leash when you were taking it for a walk and now you can’t find her! Your dog will come back if you can make the first letter of dog.",
            success: "Wonderful! ! Your dog has now returned safely home!",
            image: "AnimalRescue/Images/dog.jpg",
            sound: "AnimalRescue/Sounds/dog"
        },
        {   word: "Elephant",
            intro: "There is a baby elephant that needs to be rescued and taken back to its mother. Help rescue the baby elephant making the first letter of elephant.",
            success: "Yes! The baby elephant has now been rescued and given back to its mother.",
            image: "AnimalRescue/Images/elephant.jpg",
            sound: "AnimalRescue/Sounds/elephant"
        },
        {   word: "Frog",
            intro: "There is a frog jumping around your backyard and you need to catch it! Make the first letter of frog to catch it.",
            success: "Good job! The backyard is now quiet because you have caught the frog!",
            image: "AnimalRescue/Images/frog.jpg",
            sound: "AnimalRescue/Sounds/frog"
        },
        {   word: "Giraffe",
            intro: "You are on a safari and you see a baby giraffe wandering by itself. The baby giraffe has lost its mother! Help the baby giraffe find its mother by making the first letter of the word giraffe.",
            success: "You have helped the baby giraffe find its mother!",
            image: "AnimalRescue/Images/giraffe.jpg",
            sound: "AnimalRescue/Sounds/giraffe"
        },
        {   word: "Hippo",
            intro: "The hippo needs to find the watering hole because it is thirsty and it needs your help! Help the hippo find water by making the first letter of hippo.",
            success: "Great! You have helped the hippo find water and it is now happy!",
            image: "AnimalRescue/Images/hippo.jpg",
            sound: "AnimalRescue/Sounds/hippo"
        },
        {   word: "Iguana",
            intro: "There is an iguana in the forest in Florida that is stuck in a tree. To help free the iguana, you have to make the first letter of iguana.",
            success: "Good job! You have helped the iguana escape the tree and return home.",
            image: "AnimalRescue/Images/iguana.jpg",
            sound: ""
        },
        {   word: "Jaybird",
            intro: "There is a jaybird in the tree that is having trouble flying. To help the jaybird fly, make the first letter of jaybird.",
            success: "Good job! You have helped the jaybird get off the tree and fly into the sky!",
            image: "AnimalRescue/Images/jaybird.jpg",
            sound: "AnimalRescue/Sounds/jaybird"
        },
        {   word: "Kangaroo",
            intro: "A baby kangaroo needs to get back to its mother’s pouch! Help the baby kangaroo get back to the pouch by making the first letter of kangaroo.",
            success: "Awesome job! The baby kangaroo found its mother!",
            image: "AnimalRescue/Images/kangaroo.jpg",
            sound: ""
        },
        {   word: "Lion",
            intro: "The lion has escaped from its den! The lion needs to be captured. Help capture the lion by making the first letter of lion.",
            success: "Good job! You have captured the lion and it has returned to its den! ",
            image: "AnimalRescue/Images/lion.jpg",
            sound: "AnimalRescue/Sounds/lion"
        },
        {   word: "Monkey",
            intro: "There is the monkey! There is a tiger chasing the monkey and you can help rescue the monkey by making the first letter of the word monkey",
            success: "The monkey is now safe.",
            image: "AnimalRescue/Images/monkey.jpg",
            sound: "AnimalRescue/Sounds/monkey"
        },
        {   word: "Newt",
            intro: "There is a newt swimming in the water and it needs food. To feed the newt, make the first letter of newt.",
            success: "Wonderful! The newt is now full because it got food! ",
            image: "AnimalRescue/Images/newt.jpg",
            sound: ""
        },
        {   word: "Owl",
            intro: "You are outside in the woods and you hear the owl but you don't know where it is. You want the owl to fly over you.. Make the first letter of owl to make it fly! ",
            success: "Good job! The owl flew over you!",
            image: "AnimalRescue/Images/owl.jpg",
            sound: "AnimalRescue/Sounds/owl"
        },
        {   word: "Panda",
            intro: " black and white panda is trying to find bamboo to eat but is having trouble. Help the panda find bamboo by making the first letter of panda.",
            success: "Super! The panda found bamboo and is now nice and full! ",
            image: "AnimalRescue/Images/panda.jpg",
            sound: ""
        },
        {   word: "Bee",
            intro: "There is a bee buzzing around your ear and you want it go away! To stop the buzzing, spell the first letter of bee.",
            success: "Great! Now the bee is gone.",
            image: "AnimalRescue/Images/bee.jpg",
            sound: "AnimalRescue/Sounds/bee"
        },
        {   word: "Rhino",
            intro: "The rhino is out in the grass and starts charging towards you. You need to run! To make the rhino stop, make the first letter of rhino.",
            success: "Good job! the rhino stopped running and you are now safe.",
            image: "AnimalRescue/Images/rhino.jpg",
            sound: "AnimalRescue/Sounds/rhino"
        },
        {   word: "Snake",
            intro: "You see a snake slithering around in the grass and it is coming towards you! To capture the snake, make the first letter of snake.",
            success: "You have stopped the snake and the grass is all clear! ",
            image: "AnimalRescue/Images/snake.jpg",
            sound: "AnimalRescue/Sounds/snake"
        },
        {   word: "Tiger",
            intro: "You are on a safari tour and you see a tiger. The tiger is chasing a deer! You need to stop the tiger! Make the first letter of tiger to save the deer.",
            success: "Good job! You have saved the deer and stopped the tiger!",
            image: "AnimalRescue/Images/tiger.jpg",
            sound: "AnimalRescue/Sounds/tiger"
        },
        {   word: "Vulture",
            intro: "Quick! You see a vulture swooping down towards the road! You need to scare the vulture away before it gets hit by a car! Make the first letter of vulture to help it.",
            success: "Great! The vulture is out of the road.",
            image: "AnimalRescue/Images/vulture.jpg",
            sound: "AnimalRescue/Sounds/vulture"
        },
        {   word: "Wolf",
            intro: "There is a dangerous wolf that needs to be trapped. Help capture the wolf and save the other animals by making the first letter of wolf.",
            success: "The wolf has now been captured and all the other animals are safe.",
            image: "AnimalRescue/Images/wolf.jpg",
            sound: "AnimalRescue/Sounds/wolf"
        },
        {   word: "Zebra",
            intro: "There is the black and white striped zebra that needs to be rescued. Help rescue the zebra by making the first letter of zebra.",
            success: "The zebra has now been rescued.",
            image: "AnimalRescue/Images/zebra.jpg",
            sound: "AnimalRescue/Sounds/zebra"
        }
    ]
};

