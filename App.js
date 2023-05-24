import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, ScrollView,Alert,TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import {Dropdown} from 'react-native-element-dropdown';
import axios from 'axios';
const BASE_URL = 'https://apivisor.grupof23.com/public/';
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
  // ----------------------------------------------select dependientes ---------------------------------
  const [departamentoData, setdepartamentoData] = useState([]);
  const [municipioData, setmunicipioData] = useState([]);
  const [valordepartamento, setdepartamento] = useState(null);
  const [valormunicipio, setmunicipio] = useState(null);
  const [departamentoName, setdepartamentoName] = useState(null);
  const [municipioName, setmunicipioName] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  useEffect(() => {
    var config = {
      method: 'get',
      url: `${BASE_URL}/departamentos`,
      // headers: {
      //   'X-CSCAPI-KEY': API_KEY,
      // },
    };

    axios(config).then(response => {
        var count = Object.keys(response.data).length;
        let departamentos = [];
        for (var i = 0; i < count; i++) {
          departamentos.push({
            value: response.data[i].id_departamento,
            label: response.data[i].nombre_departamento,
          });
        }
        setdepartamentoData(departamentos);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const llamarmunicipios = codigodepartamento => {
    var config = {
      method: 'get',
      url: `${BASE_URL}/municipios/${codigodepartamento}`,
      // headers: {
      //   'X-CSCAPI-KEY': API_KEY,
      // },
    };

    axios(config).then(function (response) {
        var count = Object.keys(response.data).length;
        let stateArray = [];
        for (var i = 0; i < count; i++) {
          stateArray.push({
            value: response.data[i].id_municipio,
            label: response.data[i].nombre_municipio,
          });
        }
        setmunicipioData(stateArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <ScrollView>
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
      <View style={styles.containercolumnas}>
        <View style={[styles.example,{ borderRadius: 20 }]}>
          <Text style={[styles.centeredText]}>
              Rounded  Corners
          </Text>
        </View>
        <View style={[styles.example,{
          borderTopRightRadius: 60,
          borderBottomRightRadius: 60
        }]}>
          <Text style={[styles.centeredText]}>
              Shape
          </Text>
        </View>
        <View style={[styles.example,{
          borderTopLeftRadius: 30,
          borderBottomRightRadius: 30
        }]}>
          <Text style={[styles.centeredText]}>
            Leaf  Shape
          </Text>
        </View>
        <View style={[styles.example,{ borderRadius: 60 }]}>
          <Text style={[styles.centeredText]}>
            Circle
          </Text>
        </View>
      </View>
      <View style={{backgroundColor: '#fff', padding: 20, borderRadius: 15}}>
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={departamentoData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Seleccionar Departamento' : '...'}
          searchPlaceholder="Buscar..."
          value={valordepartamento}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setdepartamento(item.value);
            llamarmunicipios(item.value);
            setdepartamentoName(item.label);
            setIsFocus(false);
          }}
        />
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={municipioData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Seleccionar Municipio' : '...'}
          searchPlaceholder="Buscar..."
          value={valormunicipio}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setmunicipio(item.value);
            setmunicipioName(item.label);
            setIsFocus(false);
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#0F3460',
            padding: 20,
            borderRadius: 15,
            alignItems: 'center',
          }}
          onPress={() =>
            Alert.alert(
              `You have selected\nCountry: ${departamentoName}\nState: ${municipioName}`,
            )
          }>
          <Text
            style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: '600',
            }}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
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
  },
  containercolumnas: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 75,
  },
  example: {
    width: 120,
    height: 120,
    marginLeft: 50,
    marginBottom: 20,
    backgroundColor: 'grey',
    borderWidth: 2,
    justifyContent: 'center'
  },
  centeredText: {
    textAlign: 'center',
    margin: 10
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
