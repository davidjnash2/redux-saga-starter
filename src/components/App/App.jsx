import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';


function App() {
  const dispatch = useDispatch();
  const elements = useSelector(store => store.elementList)
  const [newElement, setNewElement] = useState('');

  // const getElements = () => {
  //   axios.get('/api/element').then(response => {
  //     dispatch({ type: 'SET_ELEMENTS', payload: response.data });
  //   })
  //     .catch(error => {
  //       console.log('error with element get request', error);
  //     });
  // }

  useEffect(() => {
    // getElements(),
    dispatch({
      type: 'FETCH_ELEMENTS'
    })
  }, []);

  const addElement = () => {
    // axios.post('/api/element', {
    //   name: newElement
    // })
    //   .then(() => {
    //     // getElements();
    //     dispatch({ type: 'FETCH_ELEMENTS' })
    //     setNewElement('');
    //   })
    //   .catch(error => {
    //     console.log('error with element get request', error);
    //   });

    // payload should be object or array in dispatch
    dispatch({ type: 'ADD_ELEMENT', payload: { name: newElement } })
    setNewElement('');

  }


  return (
    <div>
      <h1>Atomic Elements</h1>

      <ul>
        {elements.map((element, i )=> (
          <li key={i}>
            {element}
          </li>
        ))}
      </ul>

      <input
        value={newElement}
        onChange={evt => setNewElement(evt.target.value)}
      />
      <button onClick={addElement}>Add Element</button>
    </div>
  );
}


export default App;
