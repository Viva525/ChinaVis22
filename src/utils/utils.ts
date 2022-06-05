import { parseInt } from 'lodash';

export const getData = (func: Function, params: any) => {
  let data = func(...params);
  return new Promise((resolve, reject) => {
    resolve(data);
  });
};

export const addHiddenNodeAndLink = (dataset: any) => {
  const nodes = dataset.nodes;
  const links = dataset.links;

  const addSet = new Set();
  const newNodes = [];
  const newLinks = [];
  const newNodesId = {};
  let i = 1;
  for (let n = 0; n < nodes.length; n++) {
    if (nodes[n].properties.email_id !== undefined) {
      if (!addSet.has(nodes[n].properties.email_id)) {
        addSet.add(nodes[n].properties.email_id);
        const newEmail = {
          group: 'Email',
          id: parseInt(i++ + new Date().valueOf().toString().slice(6)),
          properties: {
            id: nodes[n].properties.email_id,
            name: nodes[n].properties.email,
            community: nodes[n].properties.community,
          },
        };
        newNodes.push(newEmail);
        newNodesId[nodes[n].properties.email_id] = newEmail.id;
      }
      const newEmailLink = {
        type: 'r_whois_email',
        source: nodes[n].id,
        target: newNodesId[nodes[n].properties.email_id],
      };
      newLinks.push(newEmailLink);
    }
    if (nodes[n].properties.phone_id !== undefined) {
      if (!addSet.has(nodes[n].properties.phone_id)) {
        addSet.add(nodes[n].properties.phone_id);
        const newPhone = {
          group: 'Phone',
          id: parseInt(i++ + new Date().valueOf().toString().slice(6)),
          properties: {
            id: nodes[n].properties.phone_id,
            name: nodes[n].properties.phone,
            community: nodes[n].properties.community,
          },
        };
        newNodes.push(newPhone);
        newNodesId[nodes[n].properties.phone_id] = newPhone.id;
      }
      const newPhoneLink = {
        type: 'r_whois_phone',
        source: nodes[n].id,
        target: newNodesId[nodes[n].properties.phone_id],
      };
      newLinks.push(newPhoneLink);
    }
    if (nodes[n].properties.register_id !== undefined) {
      if (!addSet.has(nodes[n].properties.register_id)) {
        addSet.add(nodes[n].properties.register_id);
        const newRegister = {
          group: 'Register',
          id: parseInt(i++ + new Date().valueOf().toString().slice(6)),
          properties: {
            id: nodes[n].properties.register_id,
            name: nodes[n].properties.register,
            community: nodes[n].properties.community,
          },
        };
        newNodes.push(newRegister);
        newNodesId[nodes[n].properties.register_id] = newRegister.id;
      }
      const newRegisterLink = {
        type: 'r_whois_name',
        source: nodes[n].id,
        target: newNodesId[nodes[n].properties.register_id],
      };
      newLinks.push(newRegisterLink);
    }
  }
  console.log(newNodesId);

  return { nodes: [...nodes, ...newNodes], links: [...links, ...newLinks] };
};
