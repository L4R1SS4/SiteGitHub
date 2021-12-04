(function (){
    const defaultUser = 'L4R1SS4';

    document.getElementById('search-input').value = defaultUser;
    loadUser(defaultUser);

    var xmlUser,
        xmlRepo,
        searchButton = document.getElementById('search-button'),
        searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', searchUser);

    function loadUser(user){
        xmlUser = new XMLHttpRequest();
        xmlRepo = new XMLHttpRequest();

        xmlUser.onload = showUser;
        xmlUser.open('GET', `https://api.github.com/users/${user}`);
        xmlUser.send();

        xmlRepo.onload = showRepos;
        xmlRepo.open('GET', `https://api.github.com/users/${user}/repos`);
        xmlRepo.send();
    }

    function searchUser() {
        let inputValue = searchInput.value;
        loadUser(inputValue);
    }

    function showUser() {
        /* Critério 2 : Home-page
        * API do GitHub
        * Imagem representativa do perfil
        * Pelo menos 3 dados de informação adicional (repositórios, seguidores, seguindo, twitter, descrição)
        * Ao clicar no item, o usuário é direcionado para a página especifica
        */

        if(xmlUser.status == 404){
            return alert(`O usuário ${searchInput.value} não existe!`);
        }

        let user = JSON.parse(this.responseText);

        let nome;
        if(user.name == null) nome = user.login;
        else nome = user.name;

        let twt;
        if(user.twitter_username == null) twt = ' ';
        else twt = `<i class="fab fa-twitter"></i> <a href="https://twitter.com/${user.twitter_username}" target="_blank" >${user.twitter_username}</a>`;

        let bg;
        if(user.bio == null) bg = ' ';
        else bg = user.bio;

        let profile = document.getElementById('info');
        profile.innerHTML =
            `<h4>${nome}</h4>
        <p class="user">${user.login}</p>
        <div class="row">
            <img class="card-img-top col-6 perfil" src="${user.avatar_url}" alt="${user.login}">
            <ul class="list-group list-group-flush col-6">
                <li class="list-group-item">Repositórios: <a class="list" href="https://github.com/${user.login}?tab=repositories" target="_blank">${user.public_repos}</a></li>
                <li class="list-group-item">Seguidores: <a class="list" href="https://github.com/${user.login}?tab=followers" target="_blank">${user.followers}</a></li>
                <li class="list-group-item">Seguindo: <a class="list" href="https://github.com/${user.login}?tab=following" target="_blank">${user.following}</a></li>
                <li class="list-group-item">${twt}</li>
            </ul>
        </div>
        <p class="bio">${bg}</p>
        <a href="${user.html_url}" target="_blank" class="btn"><i class="fab fa-github"></i> Ver Perfil</a>`;
    }

    function showRepos(){
        if(xmlRepo.status == 404) return false;

        let text = '';
        let repos;
        let user = JSON.parse(this.responseText);

        repos = document.getElementById('rep_rows');

        if(user.length == 0) repos.innerHTML = `<i>Nenhum repositório público encontrado.</i>`;

        for(var x = 0; x < user.length; x++) {
            let desc = '';
            let repo = user[x];
            let dateUpdated = new Date(repo.updated_at);

            if(repo.description == null) desc = " ";
            else desc = repo.description;

            text += `<div class="card card-body mb-2">
            <div class="row">
                <div class="col-md-8">
                    <h5>${repo.name} <i class="atualizacao">Última atualização em: ${dateUpdated.toLocaleString('pt-br')}</i></h5>
                    <p>${desc}</p>
                </div>
                <div class="col-md-4">
                    <a class="btn rep" href="${repo.html_url}" target="_blank"><i class="fas fa-folder"></i>  Repositório</a>`

            if(repo.has_pages == true) text += `<a class="btn rep" href="https://${repo.owner.login}.github.io/${repo.name}/" target="_blank"><i class="fas fa-desktop"></i>  WebSite</a>`;

            text += `</div></div></div>`;

            repos.innerHTML = text;
        }
    }
})();
