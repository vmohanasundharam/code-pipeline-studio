
export const storage = {
  getPipelines: () => {
    const stored = localStorage.getItem('pipelines');
    return stored ? JSON.parse(stored) : [];
  },
  
  savePipelines: (pipelines: any[]) => {
    localStorage.setItem('pipelines', JSON.stringify(pipelines));
  },
  
  getDevices: () => {
    return [
      'Machine_01',
      'Machine_02', 
      'Machine_03',
      'Sensor_A',
      'Sensor_B',
      'Controller_X',
      'Controller_Y'
    ];
  },
  
  getJSFunctions: () => {
    const stored = localStorage.getItem('jsFunctions');
    return stored ? JSON.parse(stored) : [
      {
        id: 1,
        name: 'calculateTotal',
        description: 'Calculates the total amount including price, quantity, and tax',
        arguments: [
          { name: 'price', type: 'Number', dataType: 'Number' },
          { name: 'quantity', type: 'Number', dataType: 'Number' },
          { name: 'tax', type: 'Number', dataType: 'Number' }
        ],
        returnEnabled: true,
        returnType: 'Number',
        code: 'function calculateTotal(price, quantity, tax) {\n  return (price * quantity) + tax;\n}'
      },
      {
        id: 2,
        name: 'validateEmail',
        description: 'Validates if the provided email address is in correct format',
        arguments: [
          { name: 'email', type: 'String', dataType: 'String' }
        ],
        returnEnabled: true,
        returnType: 'String',
        code: 'function validateEmail(email) {\n  const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;\n  return regex.test(email) ? "valid" : "invalid";\n}'
      }
    ];
  },
  
  saveJSFunctions: (functions: any[]) => {
    localStorage.setItem('jsFunctions', JSON.stringify(functions));
  }
};
