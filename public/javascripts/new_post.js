function post(id) {
    let title = document.getElementById("title").value;
    let content = document.getElementById("post_content").value;
    let availability = document.getElementById("availability").value;
    let images = document.getElementById("imageInput");
    let image = images.files[0];

    var form = new FormData();
    form.append("id", id);
    form.append("title", title);
    form.append("content", content);
    form.append("visibility", availability);
    if (image) {
        form.append("image", image);
    }

    var p = new XMLHttpRequest();

    p.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            window.location.pathname = "/clubs/" + id + "/posts/" + this.responseText;
        }
    };

    p.open("POST", "/clubs/" + id + "/posts/new", true);
    // p.setRequestHeader('Content-Type', 'multipart/form-data');
    p.send(form);
}

// adding an image input in html
let imageInput = document.getElementById('imageInput');
let imageLabel = document.getElementById('imageLabel');

imageInput.addEventListener('change', function(e){
    var filename = '';
    filename = e.target.value.split('\\').pop();
    if(filename){
        imageLabel.innerText = filename;
    } else {
        imageLabel.innerText = 'Add Image to Post';
    }
});
