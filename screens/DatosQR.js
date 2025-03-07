import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  BackHandler,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { getCurrentDateTime } from "../utils/DateHelper";
import { styles } from "../styles/FormStyles";
import { DataContext } from "./DataContext"; // ✅ Importar el contexto

export default function DatosQR({ route, navigation }) {
  const { qrData } = route.params;
  const { datosGuardados, setDatosGuardados } = useContext(DataContext); // 🔥 Usa el estado global

  // Estados del formulario
  const [almacen, setAlmacen] = useState("");
  const [otObra, setOtObra] = useState("");
  const [descripcionObra, setDescripcionObra] = useState("");
  const [estado, setEstado] = useState("RECIBIDO");
  const [empleadoRecibido, setEmpleadoRecibido] = useState("");
  const [fechaRecibido, setFechaRecibido] = useState("");
  const [empleadoParaDevolver, setEmpleadoParaDevolver] = useState("");
  const [fechaParaDevolver, setFechaParaDevolver] = useState("");
  const [empleadoDevuelto, setEmpleadoDevuelto] = useState("");
  const [fechaDevuelto, setFechaDevuelto] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const backHandler = useRef(null);

  useEffect(() => {
    const nuevaFecha = getCurrentDateTime();

    // Buscar si la matrícula ya existe en los datos guardados
    const registroExistente = datosGuardados.find(
      (dato) => dato.matricula === qrData
    );

    if (registroExistente) {
      // Recuperar todos los datos previos
      setAlmacen(registroExistente.almacen);
      setOtObra(registroExistente.otObra);
      setDescripcionObra(registroExistente.descripcionObra);
      setEstado(registroExistente.estado);
      setEmpleadoRecibido(registroExistente.empleadoRecibido);
      setFechaRecibido(registroExistente.fechaRecibido);
      setEmpleadoParaDevolver(registroExistente.empleadoParaDevolver);
      setFechaParaDevolver(registroExistente.fechaParaDevolver);
      setEmpleadoDevuelto(registroExistente.empleadoDevuelto);
      setFechaDevuelto(registroExistente.fechaDevuelto);
      setObservaciones(registroExistente.observaciones);
    } else {
      // Si no hay datos previos, se inicia con "RECIBIDO"
      setFechaRecibido(nuevaFecha);
      setEstado("RECIBIDO");
    }

    backHandler.current = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        navigation.goBack();
        return true;
      }
    );

    return () => backHandler.current?.remove();
  }, [qrData, datosGuardados]);

  const handleGuardar = () => {
    let nuevoEstado = estado;
    let nuevaFechaParaDevolver = fechaParaDevolver;
    let nuevaFechaDevuelto = fechaDevuelto;

    if (estado === "RECIBIDO") {
      nuevoEstado = "PARA DEVOLVER";
      nuevaFechaParaDevolver = getCurrentDateTime();
    } else if (estado === "PARA DEVOLVER") {
      nuevoEstado = "DEVUELTO";
      nuevaFechaDevuelto = getCurrentDateTime();
    }

    const nuevoRegistro = {
      matricula: qrData,
      almacen,
      otObra,
      descripcionObra,
      estado: nuevoEstado,
      empleadoRecibido,
      fechaRecibido,
      empleadoParaDevolver,
      fechaParaDevolver: nuevaFechaParaDevolver,
      empleadoDevuelto,
      fechaDevuelto: nuevaFechaDevuelto,
      observaciones,
    };

    const index = datosGuardados.findIndex((dato) => dato.matricula === qrData);
    if (index !== -1) {
      const nuevosDatos = [...datosGuardados];
      nuevosDatos[index] = nuevoRegistro;
      setDatosGuardados(nuevosDatos);
    } else {
      setDatosGuardados([...datosGuardados, nuevoRegistro]);
    }

    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden />
      <ScrollView>
        <Text style={styles.title}>Introducción de Datos</Text>

        <Text style={styles.label}>Matrícula:</Text>
        <Text style={styles.staticText}>{qrData}</Text>

        <Text style={styles.label}>Estado:</Text>
        <Text style={styles.staticText}>{estado}</Text>

        <Text style={styles.label}>Almacén:</Text>
        <TextInput
          style={styles.input}
          value={almacen}
          onChangeText={setAlmacen}
          editable={estado === "RECIBIDO"}
        />

        <Text style={styles.label}>OT Obra:</Text>
        <TextInput
          style={styles.input}
          value={otObra}
          onChangeText={setOtObra}
          keyboardType="numeric"
          editable={estado === "RECIBIDO"}
        />

        <Text style={styles.label}>Descripción Obra:</Text>
        <TextInput
          style={styles.input}
          value={descripcionObra}
          onChangeText={setDescripcionObra}
          editable={estado === "RECIBIDO"}
        />

        <Text style={styles.label}>Información Recibido:</Text>
        <TextInput
          style={styles.input}
          value={empleadoRecibido}
          onChangeText={setEmpleadoRecibido}
          editable={estado === "RECIBIDO"}
        />
        <Text style={styles.staticText}>{fechaRecibido}</Text>

        <Text style={styles.label}>Información Para Devolver:</Text>
        <TextInput
          style={styles.input}
          value={empleadoParaDevolver}
          onChangeText={setEmpleadoParaDevolver}
          editable={estado === "PARA DEVOLVER"}
        />
        <Text style={styles.staticText}>{fechaParaDevolver}</Text>

        <Text style={styles.label}>Información Devuelto:</Text>
        <TextInput
          style={styles.input}
          value={empleadoDevuelto}
          onChangeText={setEmpleadoDevuelto}
          editable={estado === "DEVUELTO"}
        />
        <Text style={styles.staticText}>{fechaDevuelto}</Text>

        <Text style={styles.label}>Observaciones:</Text>
        <TextInput
          style={styles.input}
          value={observaciones}
          onChangeText={setObservaciones}
          editable={true}
        />

        <View style={styles.buttonContainer}>
          <Button title="Guardar" onPress={handleGuardar} color="#007AFF" />
          <Button
            title="Cancelar"
            onPress={() => navigation.navigate("Home")}
            color="#FF3B30"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
