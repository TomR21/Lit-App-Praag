import React, { useState, Component } from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView, 
         Button, TextInput, LogBox, Alert, Keyboard, ScrollView} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import firebase from '@firebase/app';
import '@firebase/firestore';
//import ScoreScreen from "./screens/ScoreScreen";

// styling guide: https://gilshaan.medium.com/react-native-coding-standards-and-best-practices-5b4b5c9f4076

// for fonts, used https://dev.to/2imad/how-to-add-custom-fonts-to-a-react-native-project-with-expo-and-react-navigation-195d


// ignore timer warning
LogBox.ignoreLogs(['Setting a timer for a long period of time']);   

// Configuration info for firebase connection
const firebaseConfig = {
  apiKey: 'AIzaSyD3U29JMQbYjvjkhY7XBWi5Z5kP_m93M6w',
  authDomain: 'lit-praag-app.firebaseapp.com',
  projectId: 'lit-praag-app',
  storageBucket: 'lit-praag-app.appspot.com',
  messagingSenderId: '418051165055',
  appId: '1:418051165055:web:a3b56a103e8e85db23e84a',
};

// Navigator between score and add screen
const Stack = createStackNavigator();  

// Array containing all challenges as objects, identified by key
let challenge_array = [
  { key: 1,
    challenge: "Bak trekken 10:00 am",
    points: 5,
    availability: "1 keer per persoon per dag",
    done: false
  },
  { key: 2,
    challenge: "Afwas doen",
    points: 2,
    availability: "1 keer per groep per dag",
    done: false
  },
  { key: 3,
    challenge: "Boodschappen doen",
    points: 1,
    availability: "punt per persoon, max 3 mensen van 1 groep",
    done: true
  },
  { key: 4,
    challenge: "Bad gaan",
    points: 2,
    availability: "Oneindig",
    done: false
  },
  { key: 5,
    challenge: "Power Barf",
    points: -3,
    availability: "Oneinding",
    done: false
  },
  { key: 6,
    challenge: "Dabben voor groep chicks",
    points: 10,
    availability: "1 per team",
    done: false
  },
  { key: 7,
    challenge: "Smokkelen",
    points: 200,
    availability: "1 per team",
    done: false
  },
  { key: 8,
    challenge: "Moeder grap maken",
    points: -10,
    availability: "Oneindig",
    done: false
  },
  { key: 9,
    challenge: "Beste prank uithalen",
    points: 25,
    availability: "Stemmen",
    done: false
  },
  { key: 10,
    challenge: "Beste roast",
    points: 15,
    availability: "Stemmen",
    done: false
  },
  { key: 11,
    challenge: "400m sprint",
    points: 5,
    availability: "1 keer per uitdaging",
    done: false
  },
  { key: 12,
    challenge: "Rondje geven",
    points: 10,
    availability: "1 keer per persoon",
    done: false
  },
  { key: 13,
    challenge: "5 teq in 5 minuten",
    points: 10,
    availability: "1 keer per team",
    done: false
  },
  { key: 14,
    challenge: "Wodkaglas (5 shots) adten",
    points: 20,
    availability: "1 keer per team",
    done: false
  },
  { key: 15,
    challenge: "Creatiefste manier van adten",
    points: 15,
    availability: "Stemmen",
    done: false
  },
  { key: 16,
    challenge: "Tequila suicide",
    points: 30,
    availability: "1 keer per team",
    done: false
  },
  { key: 17,
    challenge: "Verstoppertje / Capture the Flag",
    points: 25,
    availability: "Eenmalig",
    done: false
  },
  { key: 18,
    challenge: "In rivier springen",
    points: 25,
    availability: "1 keer per team",
    done: false
  },
  { key: 19,
    challenge: "Foto dikste persoon",
    points: 25,
    availability: "Stemmen",
    done: false
  },
  { key: 20,
    challenge: "Nummer fixen",
    points: 15,
    availability: "1 keer per team",
    done: false
  },
  { key: 21,
    challenge: "Zonsopkomst halen",
    points: 10,
    availability: "1 keer per team per dag",
    done: false
  },
  { key: 22,
    challenge: "Verkeersbord jatten en bergen",
    points: 25,
    availability: "1 keer per team",
    done: false
  },
  { key: 23,
    challenge: "Adt onder de 4 seconden",
    points: 5,
    availability: "1 keer per team",
    done: false
  },
  { key: 24,
    challenge: "Liter adt in 1 minuut",
    points: 20,
    availability: "1 keer per team",
    done: false
  },
  { key: 25,
    challenge: "Adt in restaurant",
    points: 10,
    availability: "1 keer per team",
    done: false
  },
  { key: 26,
    challenge: "Beerpong winnen",
    points: 15,
    availability: "Eenmalig",
    done: false
  },
  { key: 27,
    challenge: "Broek uit op je hoofd plein",
    points: 15,
    availability: "1 keer per team",
    done: false
  },
  { key: 28,
    challenge: "Toren maken van keukenspul tot plafond",
    points: 5,
    availability: "1 keer per team",
    done: false
  },
  { key: 29,
    challenge: "Penis spel openbaar winnen",
    points: 10,
    availability: "Eenmalig",
    done: false
  },
  { key: 30,
    challenge: "LIT lied schrijven en opvoeren",
    points: 20,
    availability: "Eenmalig",
    done: false
  },
  { key: 31,
    challenge: "Drinken laten vallen",
    points: -1,
    availability: "Oneindig",
    done: false
  },
  { key: 32,
    challenge: "Pub quiz winnen",
    points: 40,
    availability: "Eenmalig",
    done: false
  },
]; 

// add log file to firestore,    works !!
function addLog(points, user_from, user_to) {
  firebase.firestore().collection('logfile').doc().set(
    {from: user_from, points: points, to: user_to, 
    createdAt: firebase.firestore.FieldValue.serverTimestamp()}
    ).then(() => console.log('Log file added'))
    .catch((error) => console.error(error))   
};

// updates team and user points,  works!!!
async function updatePoints(added_points, user) {
  // make firestore connection
  const db = firebase.firestore()

  // Obtain user points and team
  const userConnection = await db.collection('users').doc(user)
  .get()
  const current_points = userConnection.data().points
  const team = userConnection.data().team

  // update the user points 
  db.collection('users').doc(user).update({
    points: parseInt(added_points, 10) + current_points
  })
  .then(() => console.log("user_points updated"))
  .catch((error) => console.log(error))

  // 
  const totalConnection = await db.collection('totals').doc('5TXPsRhj5Kl4E6w07Jce').get()
  const team_string = "team" + team
  const team_points = totalConnection.data()[team_string]

  console.log(team_string)
  console.log(team_points)

  if(team_string == 'team1') {
    db.collection('totals').doc('5TXPsRhj5Kl4E6w07Jce').update({
    team1: parseInt(added_points, 10) + parseInt(team_points, 10)
    }).then(() => console.log("total points updated"))
    .catch((error) => console.log(error))
  } 
  if(team_string == 'team2') {
    db.collection('totals').doc('5TXPsRhj5Kl4E6w07Jce').update({
      team2: parseInt(added_points, 10) + parseInt(team_points)
      }).then(() => console.log("total points updated"))
      .catch((error) => console.log(error))
  }
}
;
// resets AddScreen states back to starting values
function resetStates(setFunc1, setFunc2, setFunc3) {
  setFunc1(null);
  setFunc2(0);
  setFunc3(null);
};

// Firebase class, retrieves data and returns component that displays them
class FirebaseApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      team_state: {
        team1_points: 0,
        team2_points: 0,
        total_points: 0
      }, 
      user_state: []
    };

    // Get team points and add them to previous state.
    this.totals = firebase.firestore().collection('totals').doc('5TXPsRhj5Kl4E6w07Jce')
    .onSnapshot(doc => {
      this.setState(prevState => ({
        ...prevState, 
        team_state: Object.assign(
          {},
          this.state.team_state,
          { team1_points: doc.data().team1,
            team2_points: doc.data().team2,
            total_points: doc.data().total
          }
        ),
        user_state: [...prevState.user_state]
      }))
    });

    // Gets each user's points, added to a list in the state
    this.userstats = firebase.firestore().collection('users')
    .onSnapshot(querySnapshot => {
      const list = [];        // List to store retrieved data in
      querySnapshot.forEach(doc => {        // For each document, make object and push to list
        const {points, team} = doc.data();
        list.push({
          id: doc.id,
          points: points,
          team: team,   
        });
      })
      // Update the state, while keeping team_state the same
      this.setState(prevState => ({    
        ...prevState,
        team_state: {...prevState.team_state},
        user_state: list 
      }))
     
    });
  };

  // render the component
  render() {
    return(
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}> 
          <View style={{flex: 0.4, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={styles.scoreText}> Team 1 </Text>
            <Text style={styles.scoreText}> P: {this.state.team_state.team1_points} </Text>

            <FlatList 
              data={this.state.user_state}
              renderItem={({ item }) => (    
                <View>           
                  { item.team == 1 ? <Text> {item.id}: {item.points} </Text> : <></>}
                </View>)}
              keyExtractor={item => item.id} />
          </View>

          <View style={{flex: 0.2}}/>

          <View style={{flex: 0.4, alignItems: 'center', justifyContent: 'center'}}> 
            <Text style={styles.scoreText}> Team 2 </Text>
            <Text style={styles.scoreText}> P: {this.state.team_state.team2_points} </Text>
            
            <FlatList 
              data={this.state.user_state}
              renderItem={({ item }) => (    
                <View>           
                  { item.team == 2 ? <Text> {item.id}: {item.points} </Text> : <></>}
                </View>)}
              keyExtractor={item => item.id} />
          </View>
        </View>
    )
  }
};

// Window that shows all challenges in a ScrollView 
function ChallengeScreen({ navigation }) {
  const getFooter = () => {
    return <Button title='Go Back' onPress={() => navigation.navigate('ScoreScreen')}/>;
  };
  
  return (
    <SafeAreaView style={{flex: 1}}>
      
        <FlatList
          data={challenge_array}
          renderItem={({item}) =>
            (
              <View style={{borderWidth: 3, borderLeftWidth: 10, borderRightWidth: 10,
                borderColor: 'black', alignItems: 'center'}}>
                <Text style={{fontWeight: 'bold'}}> {item.challenge} </Text>
                <Text> punten: {item.points} </Text>
                <Text> {item.availability} </Text>
              </View> 
            )}
          keyExtractor={item => item.key.toString()}
          ListFooterComponent={getFooter}
        />
    </SafeAreaView>
  )
};

// AddScreen Window for adding points 
function AddScreen({ navigation }) {
  const [name_from, setNameFrom] = useState(null);
  const [points, setPoints] = useState(0);
  const [name_to, setNameTo] = useState(null);

  return(
  <View style={{flex:1, alignItems: 'center', justifyContent: 'space-evenly'}}>
    <View style={{width: '70%'}}>
      <Text> From: </Text>
      <Picker
        selectedValue={name_from}
        onValueChange={(val) => setNameFrom(val)}
        >
        <Picker.Item label="----- Name -----" value="Empty" />
        <Picker.Item label="Tom" value="Tom" />
        <Picker.Item label="Ruben" value="Ruben" />
        <Picker.Item label="Mathijs" value="Mathijs" />
        <Picker.Item label="Matthijs" value="Matthijs" />
        <Picker.Item label="Jorrit" value="Jorrit" />
        <Picker.Item label="Wietse" value="Wietse" />
        <Picker.Item label="Camiel" value="Camiel" />
        <Picker.Item label="Thijs" value="Thijs" />
        <Picker.Item label="Leon" value="Leon" />
        <Picker.Item label="Ragnar" value="Ragnar" />
      </Picker>
    </View>

    <View style={{width: '70%'}}>
      <Text> Points: </Text>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput style={styles.input}
          onChangeText={(val) => setPoints(val)}
          value={points.toString()} 
          keyboardType='numeric'
          returnKeyLabel="Done"
          returnKeyType='done'
          onSubmitEditing={Keyboard.dismiss}/>
          <Button style={{height: '1%'}} 
            title='+/-' 
            onPress={() => setPoints(-1*points)}/>
      </View>
    </View>

    <View style={{width: '70%'}}>
      <Text> To: </Text>
      <Picker
        selectedValue={name_to}
        onValueChange={(val) => setNameTo(val)}
        >
        <Picker.Item label="----- Name -----" value={null} />
        <Picker.Item label="Tom" value="Tom" />
        <Picker.Item label="Ruben" value="Ruben" />
        <Picker.Item label="Mathijs" value="Mathijs" />
        <Picker.Item label="Matthijs" value="Matthijs" />
        <Picker.Item label="Jorrit" value="Jorrit" />
        <Picker.Item label="Wietse" value="Wietse" />
        <Picker.Item label="Camiel" value="Camiel" />
        <Picker.Item label="Thijs" value="Thijs" />
        <Picker.Item label="Leon" value="Leon" />
        <Picker.Item label="Ragnar" value="Ragnar" />
      </Picker>
    </View>

    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <Button style={{width: 200, height: 100}} title='Add Points' 
          onPress={() => {
            if(name_from == null || name_to == null) {
              Alert.alert("Oopsie!", "Sommige waardes missen.")
            } else if(points == 0 || !Number.isInteger(points)) {
              Alert.alert("Er is iets fout gegaan!", 
              "Je hebt geprobeerd een ongeldige hoeveelheid punten toe te voegen")
            } else {
              Alert.alert("Gefeliciteerd!", points + " punten toegevoegd aan " + name_to)
              addLog(points, name_from, name_to);
              updatePoints(points, name_to);
              resetStates(setNameFrom, setPoints, setNameTo);
          }}}/>
        <View style={{width: 100}}/>
        <Button style={{width: 200, height: 100}} title='Go Back'
          onPress={() => navigation.navigate('ScoreScreen')}/>
      </View>
    </View>
  </View>
  )
};

// ScoreScreen window, displays all information 
function ScoreScreen({ navigation }) {
    return (
    <SafeAreaView style={styles.container}>
      <View style={{flex:0.3}}/> 

      <FirebaseApp/> 

      <View style={{flex: 0.2}}/>

      <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
        <Button title='Add Points' onPress={() => navigation.navigate('AddScreen')}/>
        <View style={{flex: 0.5}}/>
        <Button title="Challenges" onPress={() => navigation.navigate('ChallengeScreen')}/>
      </View>
    </SafeAreaView>
    )
};

// All styles used in the view components 
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      alignItems: 'center',  // align on horizontal axis
      flex: 1
    },
    input: {
      borderWidth: 1,
      borderColor: '#777',
      padding: 8,
      margin: 10,
      width: 200,
    },
    scoreText: {
      fontSize: 25,
      fontFamily: 'sans-serif',
      color: 'purple'
    }
});

export default function App() {
  // Firebase initialization
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app(); // If already initialized, use that one
  };

  console.log("App has been run") 

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="ScoreScreen" 
        screenOptions={{headerTitleAlign: 'center'}}>
        <Stack.Screen name="ScoreScreen" component={ScoreScreen} 
          options={{title: "Lit App"}}/>
        <Stack.Screen name="AddScreen" component={AddScreen} 
          options={{title: "Punten Toevoegen"}}/>
        <Stack.Screen name="ChallengeScreen" component={ChallengeScreen} 
          options={{title: "Challenges"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
