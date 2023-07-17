import { useState, useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './styles/App.css'
import axios from 'axios'
import Notiflix from 'notiflix';



function App() {
	const [show, setShow] = useState(false);
	const [mode, setMode] = useState(1) // 0 = ajout client \ 1 = edit
	const [clients, setClients] = useState([])
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [phone, setPhone] = useState('')
	const [status, setStatus] = useState('actif')
	const [id, setID] = useState('')

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const handleCloseEdit = ()=>{
		setMode(0)
		setShow(false)
		setName('')
		setEmail('')
		setPhone('')
		setStatus('actif')
	}

	useEffect(()=>{
		axios.get('http://localhost:3000/clients')
		.then((res)=>{
			console.log(res.data)
			setClients(res.data)
		})
		.catch((err)=>{
			console.log(err)
			Notiflix.Notify.failure('Erreur lors du chargement de la liste des clients')
		})
	},[])

	const handleAddUser = async ()=>{
		const name = document.getElementById('name').value
		const email = document.getElementById('email').value
		const phone = document.getElementById('telephone').value

		const data = {
			name,
			email,
			phone,
			status: 'actif'
		}

		try {
			const res = await axios.post('http://localhost:3000/clients', data)
			console.log(res.data)
			Notiflix.Notify.success('Client ajouté avec succès')
			setTimeout(()=>{
				window.location.reload()
			}, 1500)
		} catch (error) {
			console.log(error)
			Notiflix.Notify.failure('Erreur lors de l\'ajout du client')
		}
	}

	const handleEditUser = async ()=>{
		const name = document.getElementById('name').value
		const email = document.getElementById('email').value
		const phone = document.getElementById('telephone').value
		let status = document.getElementById('status').value

		const data = {
			name,
			email,
			phone,
			status
		}

		try {
			const res = await axios.put(`http://localhost:3000/clients/${id}`, data)
			console.log(res.data)
			Notiflix.Notify.success('Client modifié avec succès')
			setTimeout(()=>{
				window.location.reload()
			}, 1500)
		} catch (error) {
			console.log(error)
			Notiflix.Notify.failure('Erreur lors de la modification du client')
		}
	}



	const handleDelete = async (id)=>{
		try {
			const res = await axios.delete(`http://localhost:3000/clients/${id}`)
			console.log(res.data)
			Notiflix.Notify.success('Client supprimé avec succès')
			setTimeout(()=>{
				window.location.reload()
			}, 500)
		} catch (error) {
			console.log(error)
			Notiflix.Notify.failure('Erreur lors de la suppression du client')
		}
	}

	return (
		<>
			<main className='main__content'>
				<h3>GESTION CLIENT (CRUD)</h3>
				<div className='main__content__container'>
					<div className='main__content__container__header'>
						<input type='search' placeholder='Rechercher...'></input>
						<button onClick={handleShow}>Ajouter un client</button>
					</div>
					<div className='main_content_container_body'>
						<table>
							<thead>
								<tr>
									{/* all must have a checkbox */}
									<th><input type="checkbox" /> Nom</th>
									<th><input type="checkbox" /> Email</th>
									<th><input type="checkbox" /> Phone</th>
									<th><input type="checkbox" /> Status</th>
									<th> Actions</th>
								</tr>
							</thead>
							<tbody>
								
								{
									clients.map((client)=>{
										return (
											<tr key={client._id}>
												<td><input type="checkbox" /> {client.name}</td>
												<td><input type="checkbox" /> {client.email}</td>
												<td><input type="checkbox" /> {client.phone}</td>
												<td><input type="checkbox" /> {client.status}</td>
												<td> <span onClick={
													()=>{
														setMode(1)
														setName(client.name)
														setEmail(client.email)
														setPhone(client.phone)
														setID(client._id)
														handleShow()
													}
												}>Modifier</span> | <span onClick={()=>{handleDelete(client._id)}}>Supprimer</span></td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
					</div>
				</div>
				<Modal show={show} onHide={mode === 0 ? handleClose: handleCloseEdit}>
					<Modal.Header closeButton>
					<Modal.Title>{mode === 0 ? 'Nouveau client' : 'Modifier'}</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<>
						<div class="mb-3">
							<label for="name" class="form-label">Prenom et Nom</label>
							<input type="name" class="form-control" id="name" placeholder="Ex: Romario Barro" {...(mode === 0 ? null : { value: name })} />
						</div>
						<div class="mb-3">
							<label for="email" className="form-label">Email</label>
							<input type="email" className="form-control" id="email" placeholder="Ex: denver@denver-dev.com" {...(mode === 0 ? null : { value: email })} />
						</div>
						<div class="mb-3">
							<label for="telephone" className="form-label">Telephone</label>
							<input type="number" className="form-control" id="telephone" placeholder="Ex: 777460452" {...(mode === 0 ? null : { value: phone })} />
						</div>
						{
							mode === 1 ? (
								<select class="form-select" id='status' aria-label="Status">
									<option selected>Changer le status</option>
									<option value="actif">Actif</option>
									<option value="inactif">Inactif</option>
									
								</select>
							) : null
						}
						</>
					</Modal.Body>
					<Modal.Footer>
					<Button variant="secondary" onClick={mode === 0 ? handleClose : handleCloseEdit}>
						Fermer
					</Button>
					<Button variant="primary" onClick={mode === 0 ? handleAddUser : handleEditUser}>
						Sauvegarder
					</Button>

					</Modal.Footer>
				</Modal>
			</main>
		</>
	)
}

export default App
