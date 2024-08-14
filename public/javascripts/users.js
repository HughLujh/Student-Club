function autoResize() {
    const username = document.getElementById('username');
    const contact_text = document.getElementById('contact_text');
    const bio_text = document.getElementById('bio_text');

    username.rows = 1;
    username.rows = Math.ceil(username.scrollHeight / username.clientHeight);
    contact_text.rows = 1;
    contact_text.rows = Math.ceil(contact_text.scrollHeight / contact_text.clientHeight);
    bio_text.rows = 1;
    bio_text.rows = Math.ceil(bio_text.scrollHeight / bio_text.clientHeight);
}
