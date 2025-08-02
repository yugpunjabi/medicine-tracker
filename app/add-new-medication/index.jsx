import { View, Text, ScrollViewBase } from 'react-native'
import React from 'react'
import AddMedicationHeader from '../../components/AddMedicationHeader'
import AddMedicationForm from '../../components/AddMedicationForm'
import { ScrollView } from 'react-native-web'

export default function AddNewMedication() {
  return (
    <ScrollView>
        <AddMedicationHeader/>
        <AddMedicationForm/>
    </ScrollView>
  )
}