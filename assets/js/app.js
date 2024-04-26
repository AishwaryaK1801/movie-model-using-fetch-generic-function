const cl=console.log;

const showModel = document.getElementById("showModel");
const backDrop =document.getElementById("backDrop");
const movieModel = document.getElementById("movieModel");
const closeModelBtns = [...document.querySelectorAll(".closeModel")];
const movieForm = document.getElementById("movieForm");
const titleControl = document.getElementById("title");
const imgUrlControl = document.getElementById("imgUrl");
const overviewControl = document.getElementById("overview");
const ratingControl = document.getElementById("rating");
const movieContainer =document.getElementById("movieContainer");

const addMovie = document.getElementById("addMovie");
const updateMovie = document.getElementById("updateMovie");
const loader = document.getElementById("loader");

const snackBarMsg = (msg, icon, time)=>{
  Swal.fire({
    title :msg,
    icon :icon,
    timer :time
  })
}
const baseUrl=`https://fetch-movie-model-default-rtdb.asia-southeast1.firebasedatabase.app`;
const postUrl =`${baseUrl}/data.json`;


// const modelBackdropShowHide =()=>{
//   // backDrop.classList.toggle("active");
//   // movieModel.classList.toggle("active");

// }

const modelBackdropHide =()=>{
  movieForm.reset();
 movieModel.classList.remove("active");
 backDrop.classList.remove("active");
}
const modelBackDropShow=()=>{
  movieModel.classList.add("active");
  backDrop.classList.add("active");
}

showModel.addEventListener("click", modelBackDropShow);
closeModelBtns.forEach(btn => {
  btn.addEventListener("click", modelBackdropHide);

});

const objToArr=(obj)=>{
  let postArr =[];

  for(const key in obj){
    postArr.push({...obj[key], movieId : key});
  }
  return postArr
}

const templatingOfMovies=(arr)=>{
  let result =``;
  arr.forEach(obj=>{
    result+=
    `<div class="col-md-4 col-sm-6">
    <div class="card mb-4">
      <figure class="movieCard mb-0" id="${obj.movieId}">
        <img src="${obj.imgUrl}" title="${obj.title}">
        <figcaption>
          <div class="ratingSection">
            <div class="row">
              <div class="col-md-10">
                <h3 class="mb-0 movieTitle">${obj.title}</h3>
              </div>
              <div class="col-md-2 align-self-center">
                
                  <div class="rating text-center mb-0">
                  ${obj.rating >= 4 ? `<p class="bg-success">${obj.rating}</p>`:
                   obj.rating < 4 && obj.rating >=3 ? `<p class="bg-warning">${obj.rating}</p>`:
                   obj.rating <3 ? `<p class="bg-danger">${obj.rating}</p>`:`<p class="bg-warning">${obj.rating}</p>`
                  }
                  </div>
              </div>

            </div>
          </div>
          <div class="overviewSection">
            <h4>${obj.title}</h4>
            <em>overview</em>
            <p>
            ${obj.overview} 
            </p>
            <div class="action">
              <button class="btn btn-info" onClick ="onMovieEdit(this)">Edit</button>
              <button class="btn btn-danger" onClick ="onMovieDelete(this)">Delete</button>

            </div>
          </div>
          
        </figcaption>
      </figure>
    </div>
  </div>
    
    `
  })
  movieContainer.innerHTML = result;
}

// const templatingOfMovies=(arr)=>{
//  let result=arr.map(obj=>{
//     return 
    
//     `
//     <div class="col-md-4 col-sm-6">
//     <div class="card mb-4">
//       <figure class="movieCard mb-0" id="${obj.movieId}">
//         <img src="${obj.imgUrl}" title="${obj.title}">
//         <figcaption>
//           <div class="ratingSection">
//             <div class="row">
//               <div class="col-md-10">
//                 <h3 class="mb-0 movieTitle">${obj.title}</h3>
//               </div>
//               <div class="col-md-2 align-self-center">
                
//                   <div class="rating text-center mb-0">
//                   ${obj.rating >= 4 ? `<p class="bg-success">${obj.rating}</p>`:
//                    obj.rating < 4 && obj.rating >=3 ? `<p class="bg-warning">${obj.rating}</p>`:
//                    obj.rating <3 ? `<p class="bg-danger">${obj.rating}</p>`:`<p class="bg-warning">${obj.rating}</p>`
//                   }
//                   </div>
//               </div>

//             </div>
//           </div>
//           <div class="overviewSection">
//             <h4>${obj.title}</h4>
//             <em>overview</em>
//             <p>
//             ${obj.overview} 
//             </p>
//             <div class="action">
//               <button class="btn btn-info" onClick ="onMovieEdit(this)">Edit</button>
//               <button class="btn btn-danger" onClick ="onMovieDelete(this)">Delete</button>

//             </div>
//           </div>
          
//         </figcaption>
//       </figure>
//     </div>
//   </div>
    
//     `
    
    
//   })
//   movieContainer.innerHTML=result.reverse();
// }


const onMovieEdit =(ele)=>{
  let editId = ele.closest(".movieCard").id;
  cl(editId);
  localStorage.setItem("editId", editId);
  let editUrl=`${baseUrl}/data/${editId}.json`;
  loader.classList.remove("d-none");
  makeApiCall(editUrl, "GET")
  .then(res=>{
    cl(res);
    loader.classList.add("d-none");
    modelBackDropShow();
    addMovie.classList.add("d-none");
    updateMovie.classList.remove("d-none");

    titleControl.value = res.title;
    imgUrlControl.value= res.imgUrl;
    overviewControl.value= res.overview;
    ratingControl.value = res.rating;
  })
  .catch(err=>{
    cl(err);
  })
}
const onMovieDelete =(ele)=>{
  let deleteId=ele.closest(".movieCard").id;
  cl(deleteId);

  Swal.fire({
    title: "Do you want to Remove this movie?",
    showDenyButton: true,
    // showCancelButton: true,
    confirmButtonText: "Yes, Remove it",
    denyButtonText: `Don't remove`
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      let deleteUrl=`${baseUrl}/data/${deleteId}.json`;
      loader.classList.remove("d-none");
      makeApiCall(deleteUrl, "DELETE")
      .then(res=>{
        cl(res);
        ele.closest(".col-md-4").remove();
        loader.classList.add("d-none");
        snackBarMsg("movie is deleted successfully", "success", 3000)
      })
      .catch(err=>{
        cl(err);
        loader.classList.add("d-none");
      })
    }
  });

}


const makeApiCall = (apiUrl, methodName, msgBody=null)=>{
  msgBody=msgBody? JSON.stringify(msgBody) : null;
  return fetch(apiUrl,{
    method : methodName,
    body : msgBody,
    headers :{
      "Content-type" : "Application/json"
    }
  })
  .then(res=>{
    cl(res);
    return res.json();
  })
}

const fetchPosts=()=>{
  loader.classList.remove("d-none");
  makeApiCall(postUrl, "GET")
  .then(data=>{
    cl(data);
    let postArr = objToArr(data);
    cl(postArr);
    templatingOfMovies(postArr.reverse())
    loader.classList.add("d-none");
  })
  .catch(err=>{
    cl(err)
    loader.classList.add("d-none");
  })
}

fetchPosts();

const createMovieCard=(obj)=>{
 let card=  document.createElement("div");

  card.className ="col-md-4 col-sm-6";
  card.innerHTML=`
  
  <div class="card mb-4">
      <figure class="movieCard mb-0" id="${obj.movieId}">
        <img src="${obj.imgUrl}" title="${obj.title}">
        <figcaption>
          <div class="ratingSection">
            <div class="row">
              <div class="col-md-10">
                <h3 class="mb-0 movieTitle">${obj.title}</h3>
              </div>
              <div class="col-md-2 align-self-center">
                
                  <div class="rating text-center mb-0">
                  ${obj.rating >= 4 ? `<p class="bg-success">${obj.rating}</p>`:
                   obj.rating < 4 && obj.rating >=3 ? `<p class="bg-warning">${obj.rating}</p>`:
                   obj.rating <3 ? `<p class="bg-danger">${obj.rating}</p>`:`<p class="bg-warning">${obj.rating}</p>`
                  }
                  </div>
              </div>

            </div>
          </div>
          <div class="overviewSection">
            <h4>${obj.title}</h4>
            <em>overview</em>
            <p>
            ${obj.overview} 
            </p>
            <div class="action">
              <button class="btn btn-info" onClick ="onMovieEdit(this)">Edit</button>
              <button class="btn btn-danger" onClick ="onMovieDelete(this)">Delete</button>

            </div>
          </div>
          
        </figcaption>
      </figure>
    </div>
  `;
movieContainer.prepend(card);
}



const onMovieAdd=(eve)=>{
  eve.preventDefault();
  let obj ={
    title : titleControl.value,
    imgUrl : imgUrlControl.value,
    overview : overviewControl.value,
    rating : ratingControl.value
  }

  loader.classList.remove("d-none");
  makeApiCall(postUrl, "POST", obj)
  .then(res=>{
    cl(res);
    loader.classList.add("d-none");
    
   
    obj.movieId=res.name;
    cl(obj)
    eve.target.reset();
    modelBackdropHide();
    createMovieCard(obj);
    snackBarMsg(`Movie ${obj.title} is added successfully !!`, "success", 3000)
  })
  .catch(err=>{
    cl(err);
    eve.target.reset();
    modelBackdropHide();
    
    loader.classList.add("d-none");
    snackBarMsg(err, "error", 2000)
  })
}

const onMovieUpdate=()=>{
  let updateId= localStorage.getItem("editId");
  cl(updateId);
  let updateUrl = `${baseUrl}/data/${updateId}.json`;

  let obj ={
    title : titleControl.value,
    imgUrl : imgUrlControl.value,
    overview : overviewControl.value,
    rating : ratingControl.value
  }
  loader.classList.remove("d-none");
  makeApiCall(updateUrl, "PATCH", obj)
  .then(res=>{
    cl(res);
    loader.classList.add("d-none");

    let getCard = document.getElementById(updateId);
    getCard.innerHTML =
     `
     <img src="${obj.imgUrl}" title="${obj.title}">
        <figcaption>
          <div class="ratingSection">
            <div class="row">
              <div class="col-md-10">
                <h3 class="mb-0 movieTitle">${obj.title}</h3>
              </div>
              <div class="col-md-2 align-self-center">
                
                  <div class="rating text-center mb-0">
                  ${obj.rating >= 4 ? `<p class="bg-success">${obj.rating}</p>`:
                   obj.rating < 4 && obj.rating >=3 ? `<p class="bg-warning">${obj.rating}</p>`:
                   obj.rating <3 ? `<p class="bg-danger">${obj.rating}</p>`:`<p class="bg-warning">${obj.rating}</p>`
                  }
                  </div>
              </div>

            </div>
          </div>
          <div class="overviewSection">
            <h4>${obj.title}</h4>
            <em>overview</em>
            <p>
            ${obj.overview} 
            </p>
            <div class="action">
              <button class="btn btn-info" onClick ="onMovieEdit(this)">Edit</button>
              <button class="btn btn-danger" onClick ="onMovieDelete(this)">Delete</button>

            </div>
          </div>
          
        </figcaption>
    
    `;
    snackBarMsg(`Movie ${obj.title} is updated successfully`, "succes", 3000);
  })
  .catch(err=>{
    cl(err)
    loader.classList.add("d-none");
  })
  .finally(()=>{
    movieForm.reset();
    addMovie.classList.remove("d-none");
    updateMovie.classList.add("d-none");
    modelBackdropHide();
  })
}


movieForm.addEventListener("submit", onMovieAdd);
updateMovie.addEventListener("click", onMovieUpdate)