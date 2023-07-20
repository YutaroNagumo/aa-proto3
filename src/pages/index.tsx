import {useState } from "react";
import sendOperationAndGetHash_n from '../components/normal'; 
import sendOperationAndGetHash_s from '../components/stackup';
import sendOperationAndGetHash_a from '../components/alchemy';
import sendOperationAndGetHash_z from '../components/zerodev';
import sendOperationAndGetHash_b from '../components/banana';

export default function Home() {
  const addEvent = (newEvent: string) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };
  const [selected_tool, setSelectedTool] = useState<string | null>(null);
  const [events, setEvents] = useState<string[]>([
    `A sample application to demonstrate how to integrate self-custodial\nsocial login and transacting with Web3Auth and userop.js.`,
  ]);

  ///normal///
  const sendTransaction_normal = async ()=> {
    setEvents([]);
    addEvent("Sending transaction...");
    const res = await sendOperationAndGetHash_n();
    addEvent(`hash: ${res[1]}`);
    addEvent(`explorer: https://mumbai.polygonscan.com/tx/${res[1]}`);


    
    //csvに保存
    const data = {
      tool: selected_tool ?? '',
      RunTime : res[0],
      UserOperationHash: "",
      transactionHash: res[1],
      GasFee : "",
    };

    await fetch('/api/download-csv', {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    addEvent(`csv保存完了`);
  };
  
  ///stackup///
  const sendTransaction_stackup = async () => {
    setEvents([]);
    addEvent("Sending transaction...");
    const res = await sendOperationAndGetHash_s();
    addEvent(`Transaction hash: ${res[2]}`);
    addEvent(`explorer: https://mumbai.polygonscan.com/tx/${res[2]}`);
    
    //csvに保存
    const data = {
      tool: selected_tool ?? '',
      RunTime : res[0],
      UserOperationHash: res[1],
      transactionHash: res[2],
      GasFee : "",
      };

    await fetch('/api/download-csv', {
      method: 'POST',
      body: JSON.stringify({ data }),
      headers: {
        'Content-Type': 'application/json',
      },
      });

      addEvent(`csv保存完了`);
  };

  ///alchemy///
  const sendTransaction_alchemy = async ()=> {
    setEvents([]);
    addEvent("Sending transaction...");
    const res = await sendOperationAndGetHash_a();
    if (res !== null) {
    addEvent(`hash: ${res[1]}`);
    addEvent(`JiffyScan: https://www.jiffyscan.xyz/userOpHash/${res[1]}?network=mumbai`);

    //csvに保存
    const data = {
      tool: selected_tool ?? '',
      RunTime : res[0],
      UserOperationHash: res[1],
      transactionHash: "",
      GasFee : "",
    };

    try {
      await fetch('/api/download-csv', {
        method: 'POST',
        body: JSON.stringify({ data }),
        headers: {
        'Content-Type': 'application/json',
        },
      });
      console.log('Data saved to result.csv');
    } catch (error) {
      console.error('Error saving data:', error);
    }
      } else {
        // Code to handle the null response
        console.log("Response is null.");
      }
    };


  ///zerodev///
  const sendTransaction_zerodev = async () => {
    setEvents([]);
    addEvent("Sending transaction...");
    const res = await sendOperationAndGetHash_z();
    addEvent(`UserOpHash: ${res[1]}`);
    addEvent(`JiffyScan: https://www.jiffyscan.xyz/userOpHash/${res[1]}?network=mumbai`);
    // addEvent(`Transaction hash: ${result[5]?? null}`);
    console.log(res);

    //csvに保存
    const data = {
      tool: selected_tool ?? '',
      RunTime : res[0],
      UserOperationHash: res[1],
      transactionHash: "",
      GasFee : "",
    };

    try {
      await fetch('/api/download-csv', {
        method: 'POST',
        body: JSON.stringify({ data }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Data saved to result.csv');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  ///banana///
  const makeTransaction_banana = async () => {
    setEvents([]);
    addEvent("Sending transaction...");
    const res = await sendOperationAndGetHash_b();
    if (!res) {
      addEvent("Failed to send operation. Please try again.");
      return;
    }
    addEvent(`hash: ${res[1]}`);
      //csvに保存
      const data = {
      tool: selected_tool ?? '',
      RunTime : res[0],
      UserOperationHash: "",
      transactionHash: res[1],
      GasFee : "",
      };

      //shibuyaなのでガス代取得が他と同様には行えない
      await fetch('/api/download-csv', {
        method: 'POST',
        body: JSON.stringify({ data }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
      addEvent(`csv保存完了`);
  };
  

  // 複数回実行-normal-
  const sendTransactions_normal = async (times: number, interval: number) => {
    for (let i = 0; i < times; i++) {
      await sendTransaction_normal();
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  };

  // 複数回実行-stackup-
  const sendTransactions_stackup = async (times: number, interval: number) => {
    // Loopを使って処理を複数回実行
    for (let i = 0; i < times; i++) {
      // 処理を実行
      await sendTransaction_stackup();
      // 次の処理までintervalで指定した時間だけ待機
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  };

  // 複数回実行-alchemy-
  const sendTransactions_alchemy = async (times: number, interval: number) => {
    for (let i = 0; i < times; i++) {
      await sendTransaction_normal();
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  };

  // 複数回実行-zerodev-
  const sendTransactions_zerodev = async (times: number, interval: number) => {
    for (let i = 0; i < times; i++) {
      await sendTransaction_normal();
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <div className="space-y-4">
            <div className="flex justify-end space-x-4">
             
            </div>
              <div>
              <button
                onClick={() => setSelectedTool('normal')}
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 self-center"
              >
                Normal
              </button>
              <button
                onClick={() => setSelectedTool('stackup')}
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 self-center"
              >
                Stackup
              </button>
              <button
                onClick={() => setSelectedTool('alchemy')}
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 self-center"
              >
                Alchemy
              </button>
              <button
                onClick={() => setSelectedTool('zerodev')}
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 self-center"
              >
                Zerodev
              </button>
              <button
                onClick={() => setSelectedTool('banana')}
                className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 self-center"
              >
                Banana
              </button>
              {/* <Link href="/banana">
              banana
              </Link> */}
              <h1>Selected tool: {selected_tool ? <strong style={{ color: 'red' }}>{selected_tool}</strong> : 'None'}</h1>



            </div>

              <div>
                <div className="grid grid-cols-3 grid-rows-2 gap-4">
                  <div className="col-span-1 row-span-2">
                    {/*以下の関数を真似て他のTx種類に関しても実装する*/}
                    <button
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    onClick={() => {
                      if (selected_tool == 'normal') {
                        sendTransaction_normal();
                       
                      } else if (selected_tool == 'stackup') {
                        sendTransaction_stackup();
                      } else if (selected_tool == 'alchemy') {
                        sendTransaction_alchemy();
                      } else if (selected_tool == 'zerodev') {
                        sendTransaction_zerodev();
                      } else if (selected_tool == 'banana') {
                        makeTransaction_banana();
                      }else {
                        // Optional: Handle a default case when none of the above conditions are met
                      }
                    }}
                  >
                      <h2 className={`mb-3 text-2xl font-semibold`}>
                        Transfer{" "}
                      </h2>
                      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        単純なトランザクション発行
                      </p>
                    </button>
                    
                    <button
                    className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    onClick={() => {
                      if (selected_tool == 'normal') {
                        sendTransactions_normal(
                          10,
                          5000
                        )
                      } else if (selected_tool == 'stackup') {
                        sendTransactions_stackup(
                          10,
                          5000
                        )
                      } else if (selected_tool == 'alchemy') {
                        sendTransactions_alchemy(
                          10,
                          5000
                        )
                      } else if (selected_tool == 'zerodev') {
                        sendTransactions_zerodev(
                          10,
                          5000
                        )
                      } else if (selected_tool == 'banana') {
                        addEvent("bananaは連続実行できません");
                      } else {
                        // Optional: Handle a default case when none of the above conditions are met
                      }
                    }}
                  >                    
                      <h2 className={`mb-3 text-2xl font-semibold`}>
                        Transfer x 10{" "}
                      </h2>
                      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        各Tx完了後5秒おきに10回連続でトランザクションを発行するボタン
                      </p>
                    </button>
                    <button
                      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                      onClick={() =>
                        sendTransaction_stackup()
                      }
                    >
                      <h2 className={`mb-3 text-2xl font-semibold`}>
                      Batch Transaction{" "}
                      </h2>
                      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                      未開発。バッチトランザクションの送信可能にする
                      </p>
                    </button>
                
                  </div>
                  <div className="overflow-scroll col-start-2 col-span-2 row-span-2 border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                    <div className="w-[1000px]">
                      <div className="block whitespace-pre-wrap justify-center ">
                       {/*ここでlog出力*/}
                      <pre>{events.join(`\n`)}</pre>
                      </div>
                    </div>
                </div>
              </div>
            </div>
            </div>
        </div>
      </div>
    </main>
);
}
