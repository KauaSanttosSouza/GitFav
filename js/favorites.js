export class Github {
   static search(username) {
      const endpoint = `https://api.github.com/users/${username}`
      
      return fetch(endpoint)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
         login,
         name,
         public_repos, 
         followers,
      }))
   }
}

export class FavoritesData {
   constructor(root) {
      this.root = document.querySelector(root)
      this.load()
   }

   
   async add(username) {
      try{
         const userExists = this.entries.find(entry => entry.login == username)

         if(userExists) {
            throw new Error('Usuario já cadastrado')
         }

         const user = await Github.search(username)

         if(user.login === undefined) {
            throw new Error("usuario inexistente")
         }

         this.entries = [user, ...this.entries]
         this.update()
         this.save()

      } catch (error) {
         alert(error.message)
      }
      window.location.reload()
   } 

   save() {
      localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
   }

   load() {
      this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
   }

   delete(user) {
      const filteredEntries = this.entries
      .filter((entry) => entry.login !== user.login)

      this.entries = filteredEntries
      this.update()
      this.save()
      
   }
}

export class FavoritesView extends FavoritesData {
   constructor(root) {
      super(root)
      this.tbody = this.root.querySelector('table tbody')

      this.update()
      this.onadd()
      this.noFavorites()
   }

   noFavorites() {
      if (this.entries.length === 0) {
        this.root.querySelector('.empty-state').classList.remove('hide')
      } else {
        this.root.querySelector('.empty-state').classList.add('hide')
      }
     }

   onadd() {
      const addButton = this.root.querySelector('.header button')

      addButton.onclick = () => {
         const { value } = this.root.querySelector('.header input')

         this.add(value)
      }
   }

   update() {
      this.removeAlltr()

      this.entries.forEach(user => {
         const row = this.createRow()

         row.querySelector(".users img").src = `https://github.com/${user.login}.png`
         row.querySelector('.users img').alt = `Foto de ${user.name}`
         row.querySelector('.users a').href = `https://github.com/${user.login}`
         row.querySelector('.users p').textContent = `${user.name}`
         row.querySelector('.users span').textContent = `/${user.login}`
         row.querySelector('.repositories p').textContent = `${user.public_repos}`
         row.querySelector('.followers').textContent = `${user.followers}`
         row.querySelector('.remove').onclick = () => {
            const isOk = confirm('Deseja excluir esse úsuario?')
            if(isOk) {
               this.delete(user)
               window.location.reload()
            }
         }
         this.tbody.append(row)

      })
      
   }

   createRow() {
      const tr = document.createElement('tr')

      tr.innerHTML = `
      <td class="users">
      <img src="https://github.com/maykbrito.png" alt="Foto do Mayk Brito">
      <a href="https://github.com/maykbrito" target = "blank">
         <p>Mayk Brito</p>
         <span>/maikbrito</span>
      </a>
      </td>
      <td class="repositories">
         <p>123</p>
      </td>
      <td class="followers">
         1234
      </td>
      <td class="act">
         <button class="remove">Remover

         </button>
      </td>
      `

      return tr
   }

   removeAlltr() {

      this.tbody.querySelectorAll('tr').forEach((tr) => {
         tr.remove()
      });
   }
}