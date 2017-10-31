import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes'

import base from '../base';

class App extends React.Component{
	constructor(){
		super();

		// Why binding?
		this.addFish = this.addFish.bind(this);
		// this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.updatedFish = this.updatedFish.bind(this);
		this.removeFish = this.removeFish.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);

		this.state = {
			fishes: {

			},
			order:{

			}
		}
	}

	componentWillMount(){
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`
									, {
										context: this,
										state: 'fishes'
									});
		const localStorageRef = localStorage.getItem(`order-${this.props.params.storeId}`);
		if(localStorageRef){
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnmount(){
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState){
		console.log('changed');
		console.log({nextProps, nextState});

		localStorage.setItem(`order-${this.props.params.storeId}`,
				JSON.stringify(nextState.order));
	}

	addFish(fish){
		const fishes = {...this.state.fishes}
		const timestamp = Date.now();

		fishes[`fish-${timestamp}`] = fish;

		this.setState({fishes: fishes});
	}

	updatedFish(key, updatedFish){
		const fishes = {...this.state.fishes};
		fishes[key] = updatedFish;
		this.setState({fishes: fishes});
	}

	removeFish(key){
		const fishes = {...this.state.fishes};
		fishes[key] = null;
		this.setState({fishes: fishes})
	}

	loadSamples = () => {
		this.setState({
			fishes: sampleFishes
		});
	};

	addToOrder(key){
		const order = {...this.state.order}
		order[key] = order[key] + 1 || 1;
		this.setState({order:order})
	}

	removeFromOrder(key){
		const order = {...this.state.order};
		delete order[key];
		this.setState({order:order})
	}

	render(){
		return(
			<div className='catch-of-the-day'>
				<div className='menu'>
					<Header tagline="Fresh Seafood Market" />
					<ul	className="list-of-fishes">
						{
							Object
								.keys(this.state.fishes)
								.map(key => <Fish key={key} index={key}
												details={this.state.fishes[key]}
												addToOrder={this.addToOrder}
												/>)
						}
					</ul>
				</div>
				<Order
					params={this.props.params}
					fishes={this.state.fishes}
					removeFromOrder={this.removeFromOrder}
					order={this.state.order} />
				<Inventory addFish={this.addFish}
					fishes={this.state.fishes}
					updatedFish={this.updatedFish}
					removeFish={this.removeFish}
					storeId={this.props.params.storeId}
					loadSamples={this.loadSamples} />
			</div>
		)
	}
}

App.propTypes = {
	params: React.PropTypes.object.isRequired
}
export default App;