import React, { Component } from "react"; 
import { StyleSheet, Text, View, FlatList } from "react-native"; 
import { ListItem, SearchBar } from "react-native-elements"; 
import BottomNavigationBar from '../components/BottomNavigatorBar';
//import filter from "lodash.filter";

const DATA = [ 
{ 
	id: "1", 
	title: "Cheese Cake", 
}, 
{ 
	id: "2", 
	title: "Pizza", 
}, 
{ 
	id: "3", 
	title: "Spagetti", 
}, 
{ 
	id: "4", 
	title: "Burger", 
}, 
{ 
	id: "5", 
	title: "Strawberry Milk Shake", 
}, 
{ 
	id: "6", 
	title: "Onion Rings", 
}, 
{ 
	id: "7", 
	title: "HotDog", 
}, 
{ 
	id: "8", 
	title: "KungPao Chicken", 
}, 
{ 
	id: "9", 
	title: "Chinese Fried Rice", 
}, 
{ 
	id: "10", 
	title: "Orange Chicken", 
}, 

]; 

const Item = ({ title }) => { 
return ( 
	<View style={styles.item}> 
	<Text>{title}</Text> 
	</View> 
); 
}; 

const renderItem = ({ item }) => <Item title={item.title} />; 
class Search extends Component { 
constructor(props) { 
	super(props); 
	this.state = { 
	loading: false, 
	data: DATA, 
	error: null, 
	searchValue: "", 
	}; 
	this.arrayholder = DATA; 
} 

searchFunction = (text) => { 
	const updatedData = this.arrayholder.filter((item) => { 
	const item_data = `${item.title.toUpperCase()})`; 
	const text_data = text.toUpperCase(); 
	return item_data.indexOf(text_data) > -1; 
	}); 
	this.setState({ data: updatedData, searchValue: text }); 
}; 

render() { 
	return ( 
	<View style={styles.container}> 
		<SearchBar 
		placeholder="Search Here..."
		lightTheme 
		round 
		value={this.state.searchValue} 
		onChangeText={(text) => this.searchFunction(text)} 
		autoCorrect={false} 
		/> 
		<FlatList 
		data={this.state.data} 
		renderItem={renderItem} 
		keyExtractor={(item) => item.id} 
		/> 
        <BottomNavigationBar/>
	</View> 
	); 
} 
} 

export default Search; 

const styles = StyleSheet.create({ 
container: { 
	marginTop: 30, 
	padding: 2, 
    direction:'inherit',
    backgroundColor: '#fff', // Background color of the app.,
    color: '#3ac78b'
}, 
item: { 
	backgroundColor: '#fff', 
	padding: 20, 
	marginVertical: 8, 
	marginHorizontal: 16, 
}, 
});
