import React from 'react';
import AddFishForm from "./AddFishForm";
import base from '../base';

class Inventory extends React.Component{
	constructor(){
		super();
		this.renderInventory = this.renderInventory.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.authenticate = this.authenticate.bind(this);
		this.authHandler = this.authHandler.bind(this);
		this.logout = this.logout.bind(this);
		this.renderLogin = this.renderLogin.bind(this);
		this.state = {
			uid: null,
			owner: null
		}
	}

	componentDidMount(){
		base.onAuth((user) => {
			if(user){
				this.authHandler(null, {user});
			}
		});
	}

	handleChange(e, key){
		const fish = this.props.fishes[key];
		const updatedFish = {
			...fish,
			[e.target.name]: e.target.value
		}
		this.props.updatedFish(key, updatedFish);
	}

	authenticate(provider){
		base.authWithOAuthPopup(provider, this.authHandler);
	}

	logout(){
		base.unauth();
		this.setState({uid: null});
	}

	authHandler(err, authData){
		if(err){
			console.error(err);
			return;
		}

		const storeRef = base.database().ref(this.props.storeId);
		storeRef.once('value', (snapshot) => {
			const data = snapshot.val() || {};
			if(!data.owner){
				storeRef.set({
					owner: authData.user.uid
				});
			}

			this.setState({
				uid: authData.user.uid,
				owner: data.owner || authData.user.uid
			});
		});
	}

	renderLogin(){
		return (
				<nav className="login">
					<h2>Inventory</h2>
					<p>Sign in to manage your store's inventory</p>
					<button className="facebook"
						onClick={() => this.authenticate('facebook')}>
						Login In with Facebook
					</button>
				</nav>
			)
	}

	renderInventory(key){

		const fish = this.props.fishes[key];

		return (
				<div className="fish-edit" key={key}>
 					<input type="text" name="name" value={fish.name}
 						onChange={(e) => this.handleChange(e, key)}
 						placeholder="Fish name" />
 					<input type="text" name="price" value={fish.price}
 						onChange={(e) => this.handleChange(e, key)}
 						placeholder="Fish price" />
 					<select name="status" placeholder="Fish status"
 						onChange={(e) => this.handleChange(e, key)}>
 						<option value="available">Fresh!</option>
 						<option value="unavailable">Sold Out!</option>
 					</select>
 					<textarea onChange={(e) => this.handleChange(e, key)} type="text"
 						name="desc" placeholder="Fish desc" value={fish.desc}></textarea>
 					<input type="text" name="image" value={fish.image}
 						onChange={(e) => this.handleChange(e, key)}
 						placeholder="Fish image" />
 					<button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
				</div>
			)
	}

	render(){

		const logout = <button onClick={this.logout}>Log Out!</button>

		if(!this.state.uid){
			return (<div>{this.renderLogin()}</div>);
		}

		if(this.state.uid !== this.state.owner){
			return (
					<div>
						<p>Sorry you aren't the owner of this store!</p>
						{logout}
					</div>
				)
		}

		return(
			<div>
				<h2>Inventory</h2>
				{logout}
				{Object.keys(this.props.fishes).map(this.renderInventory)}
				<AddFishForm addFish={this.props.addFish} />
				<button onClick={this.props.loadSamples}>Load Sample Fishes</button>
			</div>
		);
	}
}
export default Inventory;