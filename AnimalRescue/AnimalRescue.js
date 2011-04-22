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
        }
    ]
};

