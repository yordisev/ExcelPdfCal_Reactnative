import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
LocaleConfig.locales['es'] = {
  monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthNamesShort: ['Ene.', 'Feb.', 'Mar', 'Abr', 'Mayo', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  dayNamesShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
};
LocaleConfig.defaultLocale = 'es';
export default function App() {
  const [Fecha, SetFecha] = useState('');
  const [Fechas, SetFechas] = useState(null);
  anotherFunc = () => {
    const nextDay = ['2023-05-05', '2023-05-06', '2023-05-07', '2023-05-08', '2023-05-09', '2023-05-10'];
    var obj = nextDay.reduce((c, v) => Object.assign(c, { [v]: { selected: true, marked: true, dotColor: 'white', selectedColor: '#3393FF' } }), {});
    SetFechas(obj);
  }
  useEffect(() => {
    anotherFunc()
  }, [])
  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  // ----------------------------------------------generar pdf ---------------------------------
  let [name, setName] = useState("");

  const html = `
  <html>
    <body>
      <h1>Hi ${name}</h1>
      <p style="color: red;">Hello. Bonjour. Hola.</p>
    </body>
  </html>
`;

  let generatePdf = async () => {
    const file = await printToFileAsync({
      html: html,
      base64: false
    });

    await shareAsync(file.uri);
  };
  // ----------------------------------------------generar excel ---------------------------------
  // let generateCsv = async () => {

  // };


  return (
    <View style={styles.container}>
      <Calendar
        minDate={'2023-05-05'}
        maxDate={'2023-05-17'}
        displayLoadingIndicator={false}
        onDayPress={day => {
          SetFecha(day.dateString);
        }}
        style={{
          borderWidth: 1,
          borderRadius: 10,
          borderColor: 'black',
          height: 350,
          width: 350
        }}
        markedDates={Fechas}
      // markedDates={{

      //   [Fecha]: {selected: true, 
      //             disableTouchEvent: true, 
      //             selectedColor: '#33FF9F',
      //           },
      //           '2023-05-16': {selected: true, marked: true,dotColor: 'white', selectedColor: '#3393FF'},
      // }}
      />

      <View>
        <Text>SELECTED DATE:{Fecha}</Text>
      </View>
      <TextInput value={name} placeholder="Name" style={styles.textInput} onChangeText={(value) => setName(value)} />
      <Button title="Generate PDF" onPress={generatePdf} />
      {/* <Button title="Generate CSV" onPress={generateCsv} /> */}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: '#949c92',
    width: '90%',
    height: 50,
    margin: 5,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 50,
    color: 'black',
    fontSize: 18,
  }
});
