import React, {useState} from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FooterNav from '../components/FooterNav';
import { Picker } from '@react-native-picker/picker';

type EventProps = StackScreenProps<RootStackParamList, 'Events'>;

const StateDropdown = () => {
    const [selectedstate, setselectedstate] = useState("");

    const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];
    return(
        <View style={{padding: 8}}>
            <View style={{backgroundColor: '#1E1E1E', borderRadius: 12, overflow: 'hidden', borderWidth: 0.8, borderColor: 'rgba(78, 71, 71, 0.88)'}}>
                <Picker
                    selectedValue={selectedstate}
                    onValueChange={(value) => setselectedstate(value)}
                    style={{color: '#fff', height: 50, width: '100%'}}
                    dropdownIconColor={'#fff'}>

                    <Picker.Item label="     Select State" value="" color="#aaa" />
                    {indianStates.map((state, index) => (
                        <Picker.Item key={index} label={state} value={state} color="#fff" />
                    ))}
                </Picker>
            </View>
            {selectedstate !== "" && (
                <Text style={{color: "#00FFAA", marginTop: 10, fontSize: 16,fontWeight: "bold"}}>Selected: {selectedstate}</Text>
            )}
        </View>
    );
};

const Events: React.FC<EventProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#121212' }}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            {/* HEADER */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 14 }}>
                <Text style={{ color: '#fff', marginLeft: 8, fontSize: 22, fontWeight: "bold" }}>Events</Text>
                <TouchableOpacity style={{ marginRight: 4, width: 48, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="settings" size={26} color='#fff' />
                </TouchableOpacity>
            </View>

            {/* CONTENT AREA (ScrollView if needed) */}
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 10 }}>

                {/* Local state events section */}
                <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8, paddingBottom: 8}}>Karnataka Sports Events</Text>
                <View style={{ marginBottom: 14, justifyContent: 'center', alignItems: 'center' }}>
                    
                    <View style={{backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, flexDirection: "row", alignItems:"center", marginBottom:6, borderWidth: 0.5,borderColor: 'rgba(78, 71, 71, 0.77)'}}>
                        <Text style={{color: '#fff'}}>1.</Text>
                        <Text style={{color: '#fff', marginLeft: 8}}>Dasara Sports Meet</Text>
                        <Text style={{color: '#fff', marginLeft: 70}}>10/09/25</Text>
                    </View>
                    <View style={{backgroundColor: '#1E1E1E', padding: 18, borderRadius: 12, flexDirection: "row", alignItems:"center", marginBottom:6, borderWidth: 0.5, borderColor: 'rgba(78, 71, 71, 0.77)'}}>
                        <Text style={{color: '#fff'}}>2.</Text>
                        <View style={{flexDirection: 'column'}}>
                        <Text style={{color: '#fff', marginLeft: 8}}>Karnataka State Open</Text>
                        <Text style={{color: '#fff', marginLeft: 8}}>Athletic Meet</Text>
                        </View>
                        <Text style={{color: '#fff', marginLeft: 58}}>28/09/25</Text>
                    </View>
                    <View style={{backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, flexDirection: "row", alignItems:"center", marginBottom:12, borderWidth: 0.5, borderColor: 'rgba(78, 71, 71, 0.77)'}}>
                        <Text style={{color: '#fff'}}>3.</Text>
                        <Text style={{color: '#fff', marginLeft: 8}}>State Games</Text>
                        <Text style={{color: '#fff', marginLeft: 120}}>08/10/25</Text>
                    </View>
                    <TouchableOpacity style={{backgroundColor:'#7817a1', padding: 10, borderRadius: 30, width:300, flexDirection: "row", alignItems:"center", marginBottom:12, justifyContent: 'center', borderWidth: 0.5, borderColor: 'rgba(78, 71, 71, 0.77)'}}>
                        <Text style={{color: '#fff'}}>View more</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={24} color='#fff' style={{marginLeft:8}}/>
                    </TouchableOpacity>
                </View>

            {/* All events in the country section */}
            <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8, paddingBottom: 8}}>All India Sports Events</Text>
            <View style={{marginBottom:24}}>
              <StateDropdown />
              <View style={{ marginBottom: 14, justifyContent: 'center', alignItems: 'center' }}>
                    
                    <View style={{backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, flexDirection: "row", alignItems:"center", marginBottom:6, borderWidth: 0.5,borderColor: 'rgba(78, 71, 71, 0.77)'}}>
                        <Text style={{color: '#fff'}}>1.</Text>
                        <Text style={{color: '#fff', marginLeft: 8}}>Dasara Sports Meet</Text>
                        <Text style={{color: '#fff', marginLeft: 70}}>10/09/25</Text>
                    </View>
                    <View style={{backgroundColor: '#1E1E1E', padding: 18, borderRadius: 12, flexDirection: "row", alignItems:"center", marginBottom:6, borderWidth: 0.5, borderColor: 'rgba(78, 71, 71, 0.77)'}}>
                        <Text style={{color: '#fff'}}>2.</Text>
                        <View style={{flexDirection: 'column'}}>
                        <Text style={{color: '#fff', marginLeft: 8}}>Karnataka State Open</Text>
                        <Text style={{color: '#fff', marginLeft: 8}}>Athletic Meet</Text>
                        </View>
                        <Text style={{color: '#fff', marginLeft: 58}}>28/09/25</Text>
                    </View>
                    <View style={{backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, flexDirection: "row", alignItems:"center", marginBottom:12, borderWidth: 0.5, borderColor: 'rgba(78, 71, 71, 0.77)'}}>
                        <Text style={{color: '#fff'}}>3.</Text>
                        <Text style={{color: '#fff', marginLeft: 8}}>State Games</Text>
                        <Text style={{color: '#fff', marginLeft: 120}}>08/10/25</Text>
                    </View>
                    {/* <View style={{backgroundColor:'#7817a1', padding: 10, borderRadius: 30, width:300, flexDirection: "row", alignItems:"center", marginBottom:12, justifyContent: 'center', borderWidth: 0.5, borderColor: 'rgba(78, 71, 71, 0.77)'}}>
                        <Text style={{color: '#fff'}}>View more</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={24} color='#fff' style={{marginLeft:8}}/>
                    </View> */}
                </View>
            </View>

            </ScrollView>



        <FooterNav navigation={navigation} active="" />
        </View>
     </SafeAreaView>  );
}
export default Events;   