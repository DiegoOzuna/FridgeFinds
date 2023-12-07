/*Summary of what this page achieves

This page is was created for the user to input text in a text field and by pressing the "plus" button on the side, would be able to place that ingredient into their grocerylist.

When the user inputs an ingredient successfully, we automatically put that ingredient into the unlabled container.
All ingredients in the page would be draggable meaning that the user can press and hold to drag the item around the screen, and ideally into the other containers so that they can
categorize their ingredients as needed.
All ingredients also have a minus button tagged along with them to allow the user to delete the item from their list.

Improvements that could be made: Debugging the structure of the drag and drop methods that were created from scratch would be ideal. Currently, when the user loads into the page,
                                 the items need to be moved once, before the calculations of the containers and the draggable items work in the expected behavior. This also applies to 
                                 whenever the user scrolls through the list; only one item is needed to be moved, before the calculations work again. The thought is that maybe the states 
                                 of the dimensions of the containers are not being updated on load and whenever the user scrolls.

                                 Additionally, it might be beneficial for the user to be able to include how many of one item they want, which currently does not exist.




*/
import React, {useState, useEffect, useRef} from 'react';
import { StatusBar, TouchableOpacity, VirtualizedList, ScrollView} from 'react-native';
import { StyleSheet, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Touchable, FlatList } from 'react-native';
import { FIRESTORE_DB } from '../../firebase';  //database in our app
import { FIREBASE_AUTH } from '../../firebase';

///////////Imports for our drag and drop feature////////////////////////////
import { PanResponder, Animated } from 'react-native';
import { customAlphabet } from 'nanoid/non-secure';
///////////////////////////////////////////////////////////



import BottomNavigationBar from '../components/BottomNavigatorBar';
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from '@firebase/firestore';



////////////////////Needed animated components for handling draggable items///////////////////////////////////////
const DraggableItem = ({ item, changeBucket, removeItem }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    onPanResponderRelease: (e, gesture) => {
      changeBucket(item, gesture.moveY, gesture.moveX);
      Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: false }).start();
    },
  });


  return (
    <Animated.View //this is for the item itself, not the bucket.
    style={{ 
      transform: [{ translateX: pan.x }, { translateY: pan.y }], 
      borderWidth: 1,  // Add a border
      borderColor: 'green',  // Choose a color for the border,
      position: 'absoulte', // test
    }} 
    {...panResponder.panHandlers}
  >
    <View style={styles.itemContainer}>
      <View style={styles.itemTextContainer}>
        <Text style={styles.listItems}>{item.name}</Text>
      </View>
      <TouchableOpacity style={styles.rmvBtn} onPress={() => removeItem(item)}>
        <View style={styles.whiteLine}/>
      </TouchableOpacity>
    </View>
  </Animated.View>
  );
};
////////////////////The bucket is the container where the list is being made, as items are added into///////////////////////////////
const Bucket = React.forwardRef(({ bucket, id, changeBucket, setBucketLayout, removeItem, scrollOffset }, ref) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.measureInWindow((x, y, width, height) => {
        setBucketLayout(id, { x, y, width, height });
      });
    }
  }, [bucket, scrollOffset]);

  return (
    <View
      ref={ref}
      style={{ borderWidth: 1, borderColor: 'black', padding: 10, margin: 10, width: 300 }}
    >
      <Text style={styles.bucketTitle}>{id}</Text>
      {bucket.map((item) => (
        <DraggableItem key={item.id} item={item} changeBucket={changeBucket} removeItem={removeItem} />
      ))}
    </View>
  );
});


//////////////////////////////////////////////////////////////////////////////////////

const ShopList = () =>  { 
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);  //this is used to make custom ids in our firestore entry so that the recipes have a unique key
  const user = FIREBASE_AUTH.currentUser;  //this should get us our current user
  const database = FIRESTORE_DB;           //this would get us our database instance
  const uid = user.uid;                    //this would be the users uid if needed

  const [inputValue, setInputValue] = useState('');
  const [groceryList, setGroceryList] = useState([]);
  

  /////////////All these variables here are used to filter out the ingredient entries from the user//////////////////
  const [unlabeled, setUnlabeled] = useState([]);
  const [produce, setProduce] = useState([]);
  const [meatAndSeafood, setMeatAndSeafood] = useState([]);
  const [dairy, setDairy] = useState([]);
  const [bakeryAndBread, setBakeryAndBread] = useState([]);
  const [pantry, setPantry] = useState([]);
  const [frozenFoods, setFrozenFoods] = useState([]);
  const [beverages, setBeverages] = useState([]);
  const [snacks, setSnacks] = useState([]);
  const [other, setOther] = useState([]);
  const [bucketLayouts, setBucketLayouts] = useState({ unlabeled: null, produce: null, meatAndSeafood: null, dairy: null, bakeryAndBread: null, pantry: null, frozenFoods: null, beverages: null, snacks: null, other: null });

  /////////All these variables here are used to make sure that the bucket's y values are relative to the whole page, in order to work with calculations using the panresponder from the draggableItems moving around/////////
  const unlabeledRef = useRef();
  const produceRef = useRef();
  const meanAndSeafoodRef = useRef();
  const dairyRef = useRef();
  const bakeryAndBreadRef = useRef();
  const pantryRef = useRef();
  const frozenfoodsRef = useRef();
  const beveragesRef = useRef();
  const snacksRef = useRef();
  const otherRef = useRef();
  
  const [scrollOffset, setScrollOffset] = useState(0);

  //////////This function sets our bucket layout and also is used as an update to make sure that the dimension of the bucket are being reported///////////
  const setBucketLayout = (id, layout) => {
    setBucketLayouts((prevLayouts) => ({ ...prevLayouts, [id]: layout }));
  };
  const [scrollViewLayout, setScrollViewLayout] = useState(null);


  //////This function handles the calculation of the draggable item to ensure that if they passed the "y requirement" of a certain field, then they are added into that field.////////
  const changeBucket = async (item, y, x) => {
    let newBucket;
    const adjustedY = y ;
    if (bucketLayouts.unlabeled && adjustedY >= bucketLayouts.unlabeled.y && adjustedY <= bucketLayouts.unlabeled.y + bucketLayouts.unlabeled.height) {
      newBucket = 'unlabeled';
    } else if (bucketLayouts.produce && adjustedY >= bucketLayouts.produce.y && adjustedY <= bucketLayouts.produce.y + bucketLayouts.produce.height) {
      newBucket = 'produce';
    } else if (bucketLayouts.meatAndSeafood && adjustedY >= bucketLayouts.meatAndSeafood.y && adjustedY <= bucketLayouts.meatAndSeafood.y + bucketLayouts.meatAndSeafood.height) {
      newBucket = 'meatAndSeafood';
    } else if (bucketLayouts.dairy && adjustedY >= bucketLayouts.dairy.y && adjustedY <= bucketLayouts.dairy.y + bucketLayouts.dairy.height) {
      newBucket = 'dairy';
    } else if (bucketLayouts.bakeryAndBread && adjustedY >= bucketLayouts.bakeryAndBread.y && adjustedY <= bucketLayouts.bakeryAndBread.y + bucketLayouts.bakeryAndBread.height) {
      newBucket = 'bakeryAndBread';
    } else if (bucketLayouts.pantry && adjustedY >= bucketLayouts.pantry.y && adjustedY <= bucketLayouts.pantry.y + bucketLayouts.pantry.height) {
      newBucket = 'pantry';
    } else if (bucketLayouts.frozenFoods && adjustedY >= bucketLayouts.frozenFoods.y && adjustedY <= bucketLayouts.frozenFoods.y + bucketLayouts.frozenFoods.height) {
      newBucket = 'frozenFoods';
    } else if (bucketLayouts.beverages && adjustedY >= bucketLayouts.beverages.y && adjustedY <= bucketLayouts.beverages.y + bucketLayouts.beverages.height) {
      newBucket = 'beverages';
    } else if (bucketLayouts.snacks && adjustedY >= bucketLayouts.snacks.y && adjustedY <= bucketLayouts.snacks.y + bucketLayouts.snacks.height) {
      newBucket = 'snacks';
    } else if (bucketLayouts.other && adjustedY >= bucketLayouts.other.y && adjustedY <= bucketLayouts.other.y + bucketLayouts.other.height) {
      newBucket = 'other';
    } else {
      // If the item is dropped outside of any bucket, move it back to its original bucket
      newBucket = item.category;
    }
  
    // Create a new state for each bucket
  const newUnlabeled = unlabeled.filter(i => i.id !== item.id);
  const newProduce = produce.filter(i => i.id !== item.id);
  const newMeatAndSeafood = meatAndSeafood.filter(i => i.id !== item.id);
  const newDairy = dairy.filter(i => i.id !== item.id);
  const newBakeryAndBread = bakeryAndBread.filter(i => i.id !== item.id);
  const newPantry = pantry.filter(i => i.id !== item.id);
  const newFrozenFoods = frozenFoods.filter(i => i.id !== item.id);
  const newBeverages = beverages.filter(i => i.id !== item.id);
  const newSnacks = snacks.filter(i => i.id !== item.id);
  const newOther = other.filter(i => i.id !== item.id);

  // Add the item to the new bucket
  const newItem = { ...item, category: newBucket };
  if (newBucket === 'unlabeled') {
    newUnlabeled.push(newItem);
  } else if (newBucket === 'produce') {
    newProduce.push(newItem);
  } else if (newBucket === 'meatAndSeafood') {
    newMeatAndSeafood.push(newItem);
  } else if (newBucket === 'dairy') {
    newDairy.push(newItem);
  } else if (newBucket === 'bakeryAndBread') {
    newBakeryAndBread.push(newItem);
  } else if (newBucket === 'pantry') {
    newPantry.push(newItem);
  } else if (newBucket === 'frozenFoods') {
    newFrozenFoods.push(newItem);
  } else if (newBucket === 'beverages') {
    newBeverages.push(newItem);
  } else if (newBucket === 'snacks') {
    newSnacks.push(newItem);
  } else if (newBucket === 'other') {
    newOther.push(newItem);
  }

  // Update the state of each bucket
  setUnlabeled(newUnlabeled);
  setProduce(newProduce);
  setMeatAndSeafood(newMeatAndSeafood);
  setDairy(newDairy);
  setBakeryAndBread(newBakeryAndBread);
  setPantry(newPantry);
  setFrozenFoods(newFrozenFoods);
  setBeverages(newBeverages);
  setSnacks(newSnacks);
  setOther(newOther);

  // Update the item in Firestore
  if(docRef){
    await updateDoc(docRef, {
      grocerylist: arrayRemove(item),
    });
    await updateDoc(docRef, {
        grocerylist: arrayUnion(newItem),
    });
  }
};
  
  

  /////////////////////////////////////////////////////////////////

  //Get the document reference
  const docRef = doc(database,"users",uid);

  function fetchData(docRef) {
    // Use the get method to fetch the data once
    getDoc(docRef).then((snapshot) => {
      const data = snapshot.data();
      if(data && data.grocerylist){
        // Initialize empty arrays for each bucket
        const newUnlabeled = [];
        const newProduce = [];
        const newMeatAndSeafood = [];
        const newDairy = [];
        const newBakeryAndBread = [];
        const newPantry = [];
        const newFrozenFoods = [];
        const newBeverages = [];
        const newSnacks = [];
        const newOther = [];
  
        // Distribute the items into their respective buckets
        data.grocerylist.forEach(item => {
          switch (item.category) {
            case 'unlabeled':
              newUnlabeled.push(item);
              break;
            case 'produce':
              newProduce.push(item);
              break;
            case 'meatAndSeafood':
              newMeatAndSeafood.push(item);
              break;
            case 'dairy':
              newDairy.push(item);
              break;
            case 'bakeryAndBread':
              newBakeryAndBread.push(item);
              break;
            case 'pantry':
              newPantry.push(item);
              break;
            case 'frozenFoods':
              newFrozenFoods.push(item);
              break;
            case 'beverages':
              newBeverages.push(item);
              break;
            case 'snacks':
              newSnacks.push(item);
              break;
            case 'other':
              newOther.push(item);
              break;
            default:
              console.log(`Unknown category: ${item.category}`);
          }
        });
  
        // Update the state of each bucket
        setUnlabeled(newUnlabeled);
        setProduce(newProduce);
        setMeatAndSeafood(newMeatAndSeafood);
        setDairy(newDairy);
        setBakeryAndBread(newBakeryAndBread);
        setPantry(newPantry);
        setFrozenFoods(newFrozenFoods);
        setBeverages(newBeverages);
        setSnacks(newSnacks);
        setOther(newOther);
      }
    }).catch((error) => {
      console.log(error);
    });
  }
  


  useEffect(() => {
    // Loads the grocery list from Firestore on component mount
    if(docRef) {
      fetchData(docRef) //
    }
  }, []); // no dependency
  
  const addItem = async () => {
    if(inputValue && docRef){
      const uniqueId = nanoid(); // generates a unique ID
      const newItem = { id: uniqueId, name: inputValue, category: 'unlabeled' }; // include the uniqueId in the item object
      await updateDoc(docRef, {
        grocerylist: arrayUnion(newItem),
      });
      // Add the new item to the 'unlabeled' bucket
      setUnlabeled(prevItems => [...prevItems, newItem]);
      setInputValue('');
    }
  };
  
  //This function is basically used to remove an item from the render whenever the remove button is called, it then updates all buckets.//
  const removeItem = async (item) => {
    if(docRef){
      await updateDoc(docRef, {
        grocerylist: arrayRemove(item),
      });
      // Update the local state of the buckets
      setUnlabeled(prevItems => prevItems.filter(i => i.id !== item.id));
      setProduce(prevItems => prevItems.filter(i => i.id !== item.id));
      setMeatAndSeafood(prevItems => prevItems.filter(i => i.id !== item.id));
      setDairy(prevItems => prevItems.filter(i => i.id !== item.id));
      setBakeryAndBread(prevItems => prevItems.filter(i => i.id !== item.id));
      setPantry(prevItems => prevItems.filter(i => i.id !== item.id));
      setFrozenFoods(prevItems => prevItems.filter(i => i.id !== item.id));
      setBeverages(prevItems => prevItems.filter(i => i.id !== item.id));
      setSnacks(prevItems => prevItems.filter(i => i.id !== item.id));
      setOther(prevItems => prevItems.filter(i => i.id !== item.id));
    }
  };
  
    

  // // Code for Checkboxes (Delete when not useful)               This is left behind in case the feature would be useful. The function is old, and would need to be updated in order to work.
  //   const Checkbox = ({ checked, onPress }) => (
  //     <TouchableOpacity onPress={onPress}>
  //       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  //         {checked ? (
  //           <Text style={{ marginRight: 8, fontSize: 30}}>☒</Text>
  //         ) : (
  //           <Text style={{ marginRight: 8, fontSize: 30}}>☐</Text> 
  //         )}
  //       </View>
  //     </TouchableOpacity>
  //   );

  //   const toggleCheckbox = (index) => {
  //     setCheckedItems({
  //       ...checkedItems,
  //       [index]: !checkedItems[index],
  //     });
  //   };
  

    return(
      <SafeAreaView style={styles.container}>
        
        <Text style={[styles.screenText, {alignSelf: 'flex-start'}]}>Groceries</Text>
        <View style = {[styles.top, {marginTop: '-13.1%'}]}>
        <StatusBar style='auto'/>
          <TextInput
            style={styles.input}
            placeholder='Add Item to list'
            value={inputValue}
            onChangeText={text => setInputValue(text)} />
          <TouchableOpacity
            style = {styles.addBtn}
            onPress={addItem}>
            <Text style={[styles.addButtonText, {marginLeft: -1}]}> + </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          onScroll={(event) => {
            const offset = event.nativeEvent.contentOffset.y;
            setScrollOffset(offset);
          }}
          scrollEventThrottle={16}
          onLayout={(event) => {
            const layout = event.nativeEvent.layout;
            setScrollViewLayout(layout);
          }}
        >
            <Bucket scrollOffset={setScrollOffset} ref={unlabeledRef} bucket={unlabeled} id='unlabeled' changeBucket={changeBucket} setBucketLayout={setBucketLayout} removeItem={removeItem} />
            <Bucket scrollOffset={setScrollOffset} ref={produceRef} bucket={produce} id='produce' changeBucket={changeBucket} setBucketLayout={setBucketLayout} removeItem={removeItem} />
            <Bucket scrollOffset={setScrollOffset} ref={meanAndSeafoodRef} bucket={meatAndSeafood} id='meatAndSeafood' changeBucket={changeBucket} setBucketLayout={setBucketLayout} removeItem={removeItem} />
            <Bucket scrollOffset={setScrollOffset} ref={dairyRef} bucket={dairy} id='dairy' changeBucket={changeBucket} setBucketLayout={setBucketLayout} removeItem={removeItem} />
            <Bucket scrollOffset={setScrollOffset} ref={bakeryAndBreadRef} bucket={bakeryAndBread} id='bakeryAndBread' changeBucket={changeBucket} setBucketLayout={setBucketLayout} removeItem={removeItem} />
            <Bucket scrollOffset={setScrollOffset} ref={pantryRef} bucket={pantry} id='pantry' changeBucket={changeBucket} setBucketLayout={setBucketLayout} removeItem={removeItem} />
            <Bucket scrollOffset={setScrollOffset} ref={frozenfoodsRef} bucket={frozenFoods} id='frozenFoods' changeBucket={changeBucket} setBucketLayout={setBucketLayout} removeItem={removeItem} />
            <Bucket scrollOffset={setScrollOffset} ref={beveragesRef} bucket={beverages} id='beverages' changeBucket={changeBucket} setBucketLayout={setBucketLayout} removeItem={removeItem} />
            <Bucket scrollOffset={setScrollOffset} ref={snacksRef} bucket={snacks} id='snacks' changeBucket={changeBucket} setBucketLayout={setBucketLayout} removeItem={removeItem} />
            <Bucket scrollOffset={setScrollOffset} ref={otherRef} bucket={other} id='other' changeBucket={changeBucket} setBucketLayout={setBucketLayout} removeItem={removeItem} />
          </ScrollView>
        <BottomNavigationBar/>
      </SafeAreaView>
      
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Background color of the app.,
    color: '#3ac78b',
    alignItems: 'center'
  },

  top:{
    paddingTop:'5%',
    flexDirection:'row',
  },
// Add Btn
  addBtn: {
    backgroundColor: '#8addb9',
    borderRadius:25,
    width:50,
    height:50,
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
  },

// Remove Btn
  rmvBtn: {
    backgroundColor: 'red',
    borderRadius:25,
    width:25,
    height:25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  whiteLine: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: '#fff',
    marginTop: -1,
  },

// Grocery List Container
  listContainer: {
    width: '95%',
    paddingLeft: '1%',
    paddingTop: '1%',
  },

  itemContainer:{
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    //borderBottomWidth: 1,
    //borderBottomColor: '#ccc',   Use both of these for when we do sections!!!
  },

  itemTextContainer: {
    flex: 1,
  },

  listItems:{
    fontWeight: 'bold',
    paddingLeft: '2%',
    fontSize: 20,
    paddingTop: '0.3%',
  },

// Input Bar
  input: {
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 30,
    marginBottom: 10,
    padding: 10,
  },

// Add Btn ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  addBtn: {
    backgroundColor: '#8addb9',
    borderRadius: 15,
    width:50,
    height:50,
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 50,
    lineHeight: 54,
    paddingRight: 1,
    textAlignVertical: 'center',
  },

// Screen Title ~~~~~~~~~~~~~~~~~~~~~~~~~~
  screenText: {
    fontSize: 50,
    color: '#34785a',
    fontWeight: '900',
    marginLeft: '2%',
  },

  bucketTitle: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: '900',
    color: '#8addb9'
  },

});


export default ShopList