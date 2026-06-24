# Detector de Quedas 📱⚠️

Aplicativo móvel desenvolvido em **React Native + Expo** que estima quedas
em tempo real utilizando os sensores do aparelho. O **acelerômetro** é o sensor
principal e o **giroscópio** é usado como sensor auxiliar para aumentar a
precisão da detecção. Quando uma queda é identificada, uma mensagem de alerta
é exibida na tela (com vibração e contagem regressiva de emergência).

> Trabalho da disciplina de Programação para Dispositivos Móveis.

---

## ✨ Funcionalidades

- **Detecção de queda em tempo real** a partir do acelerômetro e giroscópio.
- **Alerta em tela cheia** quando uma queda é confirmada, com vibração e
  contagem regressiva de "emergência" cancelável pelo botão *Estou bem*.
- **Painel ao vivo** com a magnitude da aceleração e os eixos X/Y/Z.
- **Sensibilidade ajustável** (Baixa / Média / Alta) para reduzir falsos positivos
  ou aumentar a detecção.
- **Histórico de quedas** registradas durante a sessão.
- **Botão "Simular queda"** para demonstrar o funcionamento sem precisar
  derrubar o aparelho.

---

## 🧠 Como funciona o algoritmo

O acelerômetro retorna a aceleração em unidades de **g** (1 g = 9,81 m/s²).
Em repouso, a *magnitude total* da aceleração é de aproximadamente **1 g**,
pois o sensor mede a gravidade.

A magnitude é calculada como:

```
|a| = √(x² + y² + z²)
```

Uma queda real segue um padrão característico, detectado por uma **máquina de
estados** (`src/utils/fallDetector.js`):

| Fase | O que acontece | Detecção |
|------|----------------|----------|
| 1. **Queda livre** | O corpo cai e o sensor entra em "ausência de peso" | `|a|` cai abaixo do limiar (ex.: < 0,55 g) |
| 2. **Impacto** | Ao bater no chão há um pico forte de aceleração | `|a|` ultrapassa o limiar de impacto (ex.: > 2,5 g) |
| 3. **Imobilidade** | A pessoa tende a ficar parada após cair | `|a|` volta para ~1 g e permanece estável por ~1,2 s |

Somente quando essa **sequência completa** ocorre dentro das janelas de tempo
esperadas é que a queda é confirmada e o alerta aparece.

### Sensor auxiliar (giroscópio)

O **giroscópio** mede a velocidade angular (rad/s). Uma queda real quase sempre
vem acompanhada de uma rotação brusca do aparelho. Quando isso é detectado
próximo ao impacto, marcamos o evento como *rotação confirmada*, o que aumenta
a confiança de que foi uma queda de verdade — e não apenas o celular batendo
sobre a mesa. Isso atende à sugestão do enunciado de usar sensores auxiliares
para melhorar a precisão.

Os limiares ficam centralizados em `src/utils/constants.js` e podem ser
ajustados conforme o aparelho/uso.

---

## 📁 Estrutura do projeto

```
detector-de-quedas/
├── App.js                      # ponto de entrada (renderiza a tela principal)
├── index.js                    # registra o componente raiz do Expo
├── app.json                    # configuração do Expo
├── babel.config.js
├── package.json
└── src/
    ├── components/
    │   ├── FallAlert.js          # alerta em tela cheia de queda
    │   ├── HistoryList.js        # histórico de quedas
    │   ├── MagnitudeGauge.js     # medidor da magnitude da aceleração
    │   ├── SensitivitySelector.js# seletor de sensibilidade
    │   ├── SensorReadout.js      # leitura dos eixos X/Y/Z
    │   └── StatusBadge.js        # "semáforo" do estado atual
    ├── hooks/
    │   └── useFallDetection.js   # liga os sensores ao algoritmo
    ├── screens/
    │   └── HomeScreen.js         # tela principal
    ├── theme/
    │   └── colors.js             # paleta de cores
    └── utils/
        ├── constants.js          # limiares e estados
        ├── fallDetector.js       # ALGORITMO (máquina de estados)
        └── math.js               # funções matemáticas auxiliares
```

---

## 🚀 Instalação e execução

### Pré-requisitos

- **Node.js** 18 ou superior — <https://nodejs.org>
- **App Expo Go** no celular (Android ou iOS), disponível na Play Store / App Store.
  > Importante: os sensores só funcionam em um **celular físico**.
  > Emuladores e o modo navegador (web) geralmente não possuem acelerômetro.

### Passo a passo

1. **Clonar o repositório:**

   ```bash
   git clone https://github.com/SEU_USUARIO/detector-de-quedas.git
   cd detector-de-quedas
   ```

2. **Instalar as dependências:**

   ```bash
   npm install
   ```

3. **(Recomendado) Alinhar as versões nativas ao seu SDK do Expo:**

   ```bash
   npx expo install expo-sensors expo-status-bar
   ```

4. **Iniciar o projeto:**

   ```bash
   npx expo start
   ```

5. **Abrir no celular:** abra o app **Expo Go** e escaneie o **QR Code**
   mostrado no terminal (o celular precisa estar na mesma rede Wi-Fi do
   computador).

---

## 📲 Como testar

1. Toque em **Iniciar monitoramento** e conceda permissão de uso dos sensores.
2. Observe o medidor de magnitude reagir ao movimentar o aparelho.
3. Para uma demonstração segura, toque em **Simular queda (teste)** — o app
   reproduz internamente a sequência queda livre → impacto → imobilidade e
   dispara o alerta.
4. Para um teste real, deixe cair o celular sobre uma superfície macia
   (ex.: uma almofada). A sensibilidade pode ser ajustada antes do teste.
5. Quando o alerta aparecer, toque em **Estou bem** para cancelar a contagem
   regressiva de emergência.

---

## 🛠️ Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/) (SDK 54)
- [expo-sensors](https://docs.expo.dev/versions/latest/sdk/sensors/) (Accelerometer e Gyroscope)
