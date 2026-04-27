(() => {
    "use strict";

    //fetch all the forms we want to apply custom Bootstrap validation styles to 
    const forms = document.querySelectorAll(".needs-validation");
    
    //loop over them and prevent submission 
    Array.from(forms).forEach((form) => {
        form.addEventListener(
            "submit",
            (event) => {
                if(!form.checkValidity()){
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add("was-validated");
            },
            false
        );
    });
})();


// Heart button toggle
document.addEventListener("DOMContentLoaded", () => {
    // get saved likes from localStorage
    let likedListings = JSON.parse(localStorage.getItem("likedListings")) || [];

    // set hearts red for already liked listings
    document.querySelectorAll(".heart-btn").forEach((btn) => {
        let id = btn.dataset.id;
        if(likedListings.includes(id)){
            btn.classList.add("liked");
            btn.querySelector("i").classList.remove("fa-regular");
            btn.querySelector("i").classList.add("fa-solid");
        }

        // click event
        btn.addEventListener("click", (e) => {
            e.preventDefault(); // prevent opening listing page
            e.stopPropagation();

            let id = btn.dataset.id;

            if(likedListings.includes(id)){
                // unlike - remove from list
                likedListings = likedListings.filter(item => item !== id);
                btn.classList.remove("liked");
                btn.querySelector("i").classList.remove("fa-solid");
                btn.querySelector("i").classList.add("fa-regular");
            } else {
                // like - add to list
                likedListings.push(id);
                btn.classList.add("liked");
                btn.querySelector("i").classList.remove("fa-regular");
                btn.querySelector("i").classList.add("fa-solid");
            }

            // save to localStorage
            localStorage.setItem("likedListings", JSON.stringify(likedListings));
        });
    });
});