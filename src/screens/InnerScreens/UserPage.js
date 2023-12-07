//place holder for area where user will be able to search for recipes.
//These imports are to have our bottomnavigation bar be on screen
import React, {useState, useEffect, useRef} from 'react';
import { StatusBar, TouchableOpacity, VirtualizedList, ScrollView} from 'react-native';
import { StyleSheet, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, Touchable, FlatList } from 'react-native';
import { FIRESTORE_DB } from '../../firebase';  //database in our app
import { FIREBASE_AUTH } from '../../firebase';

///////////DELETE IF NO WORK pt1////////////////////////////
import { PanResponder, Animated } from 'react-native';
import { customAlphabet } from 'nanoid/non-secure';
///////////////////////////////////////////////////////////



import BottomNavigationBar from '../components/BottomNavigatorBar';
import { getDoc, doc, updateDoc, arrayUnion, arrayRemove } from '@firebase/firestore';



//DELETE IF NO WORK pt2///////////////////////////////////////
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
    <Animated.View //this is for the item itself, not da bucket.
    style={{ 
      transform: [{ translateX: pan.x }, { translateY: pan.y }], 
      borderWidth: 1,  // Add a border
      borderColor: 'red',  // Choose a color for the border,
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
///////////////////////////////////////////////////
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

const UserPage = () =>  { 
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);
  const user = FIREBASE_AUTH.currentUser;  //this should get us our current user
  const database = FIRESTORE_DB;
  const uid = user.uid;

  const [inputValue, setInputValue] = useState('');
  const [myIngredients, setmyIngredients] = useState([]);
  

  /////////////DELETE IF NO WORK pt3//////////////////
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

  
  const setBucketLayout = (id, layout) => {
    setBucketLayouts((prevLayouts) => ({ ...prevLayouts, [id]: layout }));
  };
  const [scrollViewLayout, setScrollViewLayout] = useState(null);



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
      myIngredients: arrayRemove(item),
    });
    await updateDoc(docRef, {
        myIngredients: arrayUnion(newItem),
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
      if(data && data.myIngredients){
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
        data.myIngredients.forEach(item => {
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
        myIngredients: arrayUnion(newItem),
      });
      // Add the new item to the 'unlabeled' bucket
      setUnlabeled(prevItems => [...prevItems, newItem]);
      setInputValue('');
    }
  };
  

  const removeItem = async (item) => {
    if(docRef){
      await updateDoc(docRef, {
        myIngredients: arrayRemove(item),
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
  
    

    const renderItem = ({item, index}) => (
      <DraggableItem key={item.id} item={item} changeBucket={changeBucket} removeItem={removeItem} />
    );
  

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


export default UserPage