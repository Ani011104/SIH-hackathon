// src/pages/Dashboard.tsx

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParamList} from "../../App";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FooterNav from "../components/FooterNav";
import { exercises } from "../config/exercises";

// ✅ Import local storage score
import { getOverallScore } from "../services/storage";
import { getFinalResult } from "../services";

type DashProps = StackScreenProps<RootStackParamList, 'Dashboard'>;

const Dashboard: React.FC<DashProps> = ({navigation}) => {
    return(
    <SafeAreaView style={{flex: 1, backgroundColor: '#121212'}}>
       <View style={{ flex: 1, justifyContent: 'space-between' }}>
    
    {/* HEADER */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 14 }}>
      <Text style={{ color: '#fff', marginLeft: 8, fontSize: 22, fontWeight: "bold" }}>Dashboard</Text>
      <TouchableOpacity style={{ marginRight: 4, width: 48, height: 30, alignItems: 'center', justifyContent: 'center' }}>
        <MaterialIcons name="settings" size={26} color='#fff' />
      </TouchableOpacity>
    </View>

    {/* CONTENT AREA (ScrollView if needed) */}
    {/* <ScrollView> ... </ScrollView> */}
      <ScrollView contentContainerStyle={{padding:16, paddingBottom: 10}}>
        <View style={{marginBottom: 24}}>
          <Text style={{color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 12, marginLeft: 8}}>Primary Actions</Text>
          <View style={{flexDirection: "column", gap: 8}}>
            <TouchableOpacity style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderRadius: 12, backgroundColor: '#7817a1'}}
              onPress={() => 
                navigation.navigate('SelectSport')
              }>
                <MaterialIcons name="videocam" size={28} color='#fff' style={{marginLeft: 28}}/>
                <Text style={{color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 40}}>Record New Test</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, flexDirection: 'row', backgroundColor: '#1E1E1E', paddingVertical: 14, alignItems: 'center', borderRadius: 12, borderWidth: 0.5, borderColor: 'rgba(78, 71, 71, 0.77)'}}
            onPress={()=>
              navigation.navigate('Leaderboard')}>
                <MaterialIcons name="leaderboard" size={28} color='#fff' style={{marginLeft: 28}}/>
                <Text style={{color:'#fff', fontSize: 16, fontWeight: '600', marginLeft: 40}}>Leaderboard</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Events section */}
        <View style={{marginBottom:24}}>
              <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 8, marginBottom: 12}}>Upcoming Events</Text>
              <View style={{backgroundColor: '#1E1E1E', padding: 20, borderRadius: 12, flexDirection: "row", alignItems:"center", marginBottom:12}}>
                <View style={{flex:1}}>
                  <Text style={{color:'#bbb', fontSize: 12}}>Local events[this months]</Text>
                  <Text style={{color: '#fff', fontSize: 12, marginTop: 8, marginLeft: 16}}>Karnataka</Text>
                  <Text style={{color: '#fff', fontSize: 12, marginTop: 2, marginLeft: 16}}>22 events</Text>
                </View>
                <View style={{}}>
                  <TouchableOpacity style={{ backgroundColor:'#7817a1', padding:10, borderRadius: 10, width:100, alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontWeight: 'bold'}}>Join event</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={{color:'#bbb', textAlign: 'center'}}>All events in the country</Text>

              <TouchableOpacity style={{flex:1, flexDirection: 'row', backgroundColor:'#333333', alignItems: 'center', paddingVertical: 8, justifyContent: 'center', borderRadius: 24}} 
              onPress={()=>
                navigation.navigate('Events')}>
                <Text style={{color:'#fff'}}>View details</Text>
                <MaterialIcons name="east" size={24} color='#fff' style={{marginLeft:8}}/>
              </TouchableOpacity>
        </View>

        {/* Personal Score */}
      <View style={{marginBottom:24}}>
        <Text style={{color:'#fff', fontSize: 18, fontWeight: 'bold', marginLeft:9, marginBottom:12}}>Personal Score</Text>
        <View style={{flex:1, flexDirection: 'column', backgroundColor: '#1E1E1E', padding:12, borderRadius: 12}}>
              <View style={{backgroundColor: '#333', padding: 20, borderRadius: 12, flexDirection: "row", alignItems:"center", marginBottom:12}}>
                <View style={{flex:1}}>
                  <Text style={{color:'#bbb', fontSize: 14}}>Your Best Score</Text>
                  <Text style={{color: '#fff', fontSize: 28, marginTop: 4, marginLeft: 20, fontWeight: 'bold'}}>85</Text>
              </View>
              <View style={{width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: "#7817a1", backgroundColor: "#333"}}/>
        </View>
        <View style={{flex:1, flexDirection: 'row', backgroundColor: '#333', padding:12, borderRadius: 12, justifyContent: 'space-between'}}>
          <Text style={{color:'#fff', marginLeft: 8}}>Squats</Text>
          <Text style={{color:'#fff', marginRight: 20}}>23</Text>
        </View>
        <View style={{flex:1, flexDirection: 'row', backgroundColor: '#333', padding:12, borderRadius: 12, justifyContent: 'space-between', marginTop: 6}}>
          <Text style={{color:'#fff', marginLeft: 8}}>Sit-ups</Text>
          <Text style={{color:'#fff', marginRight: 20}}>20</Text>
        </View>
        <View style={{flex:1, flexDirection: 'row', backgroundColor: '#333', padding:12, borderRadius: 12, justifyContent: 'space-between', marginTop: 6}}>
          <Text style={{color:'#fff', marginLeft: 8}}>Vertical-Jumps</Text>
          <Text style={{color:'#fff', marginRight: 10}}>60 cm</Text>
        </View>
        <View style={{flex:1, flexDirection: 'row', backgroundColor: '#333', padding:12, borderRadius: 12, justifyContent: 'space-between', marginTop: 6}}>
          <Text style={{color:'#fff', marginLeft: 8}}>Push-ups</Text>
          <Text style={{color:'#fff', marginRight: 20}}>33</Text>
        </View>
        <View style={{flex:1, flexDirection: 'row', backgroundColor: '#333', padding:12, borderRadius: 12, justifyContent: 'space-between', marginTop: 6}}>
          <Text style={{color:'#fff', marginLeft: 8}}>Long-jump</Text>
          <Text style={{color:'#fff', marginRight: 2}}>240 cm</Text>
        </View>
      </View>
      </View>


      </ScrollView>
    {/* FOOTER */}
    <FooterNav navigation={navigation} active="Dashboard" />
  </View>
    </SafeAreaView>
    );
}
export default Dashboard;