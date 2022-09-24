
import {useMemo, useState} from "react";
import "./App.css";
import Artboard from "./Artboard";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  getLedgerWallet,
  getPhantomWallet,
  getSlopeWallet,
  getSolflareWallet,
  getSolletExtensionWallet,
  getSolletWallet,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import MyWallet from "./MyWallet";

function App() {
  // Can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Mainnet;
  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const [paletteState,setPaletteState]=useState([[1,31,75],[3,57,108],[0,91,150],[100,151,177],[179,205,224]]);
  const [lockState,setLockState]=useState([false,false,false,false,false]);
  const [currentColorState,setCurrentColorState]=useState(paletteState[0]);
  const rgb_string = (...color_list: number[]) => {  
    return `rgb(${color_list[0]},${color_list[1]},${color_list[2]})`;
  }
  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const change_palette_color = (index: number,color_list: number[]) => {
    let new_state=[...paletteState];
    new_state[index]=[...color_list];
    setPaletteState(new_state);
  }
  const insert_color = (color_list: number[]) => {
    let paletteString = JSON.stringify(paletteState);
    let color_list_string = JSON.stringify(color_list);
    let unlocked_indexes=[];
    if ( !paletteString.includes(color_list_string)){
      for (var i = 0; i < lockState.length; i++) {
        if (lockState[i]===false){
          unlocked_indexes.push(i);
        }
      
      }
      switch(unlocked_indexes.length) {
        case 0:
          console.log("No unlocked slots in palette")
          break;
        case 1:
          change_palette_color(unlocked_indexes[0],color_list);
          break;
        default:
          let new_state=[...paletteState];
          new_state[unlocked_indexes[0]]=color_list;
          for (i = 0; i < unlocked_indexes.length-1; i++) {
            new_state[unlocked_indexes[i+1]]=paletteState[unlocked_indexes[i]];
          }
          setPaletteState(new_state);
          
      }
    }
    else {
       console.log("Color already in palette")
    }


  }
  const change_current_color = (color_list: number[]) => {
    
    setCurrentColorState([color_list[0],color_list[1],color_list[2]]);
  }
  
  const change_lock = (index : number) => {
    let new_state = [...lockState];
    new_state[index]=!new_state[index];
    setLockState(new_state);
  }
  function ColorToHex(color: number) {
    var hexadecimal = color.toString(16).toUpperCase();
    return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
  }
  
  function ConvertRGBtoHex(color_list: number[]) {
    return "#" + ColorToHex(color_list[0]) + ColorToHex(color_list[1]) + ColorToHex(color_list[2]);
  }

  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSlopeWallet(),
      getSolflareWallet(),
      getLedgerWallet(),
      getSolletWallet({ network }),
      getSolletExtensionWallet({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <div className="App">
          <header className="App-header">
            <div className="left-header">
              <div className="logo" style={{ background: rgb_string(...currentColorState) }}></div>
              <h3>SolPlace</h3>
            </div>
            <div className="middle-header">
              <div className="color-choice">
                <div className="current-color">
                  <div className="color-sample current"  style={{ background: rgb_string(...currentColorState) }}>
                    
                  </div>
                  <h4>HEX</h4>
                  <h4 className="dark"> {ConvertRGBtoHex(currentColorState)}</h4>
                  <h4>RGB</h4>
                  <h4 className="dark"> {currentColorState[0]}, {currentColorState[1]}, {currentColorState[2]}</h4>
                </div>
                <div className="color-palette">
                  
                <div className="color-sample" data-index={0} style={{ background: rgb_string(...paletteState[0]) }} onClick={() => {change_current_color(paletteState[0])}}>
                <div className="lock-box" onClick={()=>{change_lock(0)}}>
                  <div className="lock" data-state={lockState[0]} onClick={()=>{change_lock(0)}}></div>
                </div>
                    </div>
                    <div className="color-sample" style={{ background: rgb_string(...paletteState[1]) }} onClick={() => {change_current_color(paletteState[1])}}>
                    <div className="lock-box" onClick={()=>{change_lock(1)}}>
                    <div className="lock" data-state={lockState[1]} onClick={()=>{change_lock(1)}} ></div>
                    </div>
                  </div>
                  <div className="color-sample" style={{ background: rgb_string(...paletteState[2]) }} onClick={() => {change_current_color(paletteState[2])}} >
                  <div className="lock-box" onClick={()=>{change_lock(2)}}>
                  <div className="lock" data-state={lockState[2]} onClick={()=>{change_lock(2)}}></div>
                  </div>
                  </div>
                  <div className="color-sample" style={{ background: rgb_string(...paletteState[3]) }} onClick={() => {change_current_color(paletteState[3])}}>
                  <div className="lock-box" onClick={()=>{change_lock(3)}}>
                  <div className="lock" data-state={lockState[3]}  ></div>
                  </div>
                  </div>
                  <div className="color-sample" data-index={4} style={{ background: rgb_string(...paletteState[4]) }} onClick={() => {change_current_color(paletteState[4])}}>
                  <div className="lock-box"  onClick={()=>{change_lock(4)}}>
                  <div className="lock" data-state={lockState[4]}></div>
                  </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="right-header">
              <MyWallet />
            </div>
            
          </header>
        </div>
        <div className="main">
          <Artboard currentColorState={currentColorState}></Artboard>
          <button  onClick={() => {insert_color([Math.floor(Math.random() * 255), Math.floor(Math.random() * 255),  Math.floor(Math.random() * 255)])}}> Click Me</button>
          <div className="color-input">
            <form onSubmit={(event)=>{
              event.preventDefault();
            }} >
              <input type="number" id="r" name="r" min="0" max="255"/>
              <input type="number" id="g" name="g" min="0" max="255"/>
              <input type="number" id="b" name="b" min="0" max="255"/>
              <input type="submit" value="Submit" />
            </form>
          </div>
        </div>x
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;

