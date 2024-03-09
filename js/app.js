function start() {
    const quantity = document.querySelector('#quantity');
    const profileSelect = document.querySelector('#profile');
    const customProfile = document.querySelector('#custom-profile');
    const customProfileInput = document.querySelector('#custom-profile-input');
    const customCharsGroup = document.querySelector('#custom-chars');
    const customCharsInput = document.querySelector('#custom-chars-input');
    const charTypeSelect = document.querySelector('#char-type');
    const hotspotServer = document.querySelector('#hotspot-server');
    const customServer = document.querySelector('#custom-server');
    const customServerInput = document.querySelector('#custom-server-input');
    const days = document.querySelector('#uptime-days');
    const hours = document.querySelector('#uptime-hours');
    const minutes = document.querySelector('#uptime-minutes');
    const seconds = document.querySelector('#uptime-seconds');
    const pinLengthLabel = document.querySelector('#pin-length-label');
    const pinLengthInput = document.querySelector('#pin-length');
    const priceInput = document.querySelector('#price');
    const messageField = document.querySelector('#message-field');
    const btnGenerate = document.querySelector('#btnGenerate');
    const btnCopy = document.querySelector('#btnCopy');
    const btnDownload = document.querySelector('#btnDownload');
    const btnPrint = document.querySelector('#btnPrint');
    const btnClean = document.querySelector('#btnClean');
    const generatedList = document.querySelector('#generated-list');
    const codeContainer = document.querySelector('#code-container');

    let tmpDate = '';

    function handleProfileChange() {
        if (profileSelect.value === 'Personalizado') {
            customProfile.classList.remove('d-none');
        } else {
            customProfile.classList.add('d-none');
            customProfileInput.value = '';
        }
    }

    function handleCharTypeChange() {
        if (charTypeSelect.value === 'custom') {
            customCharsGroup.classList.remove('d-none');
        } else {
            customCharsGroup.classList.add('d-none');
            customCharsInput.value = '';
        }
    }

    function handleServerChange() {
        if (hotspotServer.value === 'Personalizado') {
            customServer.classList.remove('d-none');
        } else {
            customServer.classList.add('d-none');
            customServerInput.value = '';
        }
    }

    function enableButtons() {
        btnCopy.classList.remove('gray');
        btnDownload.classList.remove('gray');
        btnPrint.classList.remove('gray');
        btnClean.classList.remove('gray');

        btnCopy.classList.add('green');
        btnDownload.classList.add('blue');
        btnPrint.classList.add('yellow');
        btnClean.classList.add('purple');

        btnCopy.disabled = false;
        btnDownload.disabled = false;
        btnPrint.disabled = false;
        btnClean.disabled = false;
    }

    function generateCode(pinLength, charType, customChars) {
        let characters = '';

        switch (charType) {
            case 'numeric':
                characters = '0123456789';
                break;
            case 'alpha':
                characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                break;
            case 'alphanumeric':
                characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                break;
            case 'custom':
                characters = customChars;
                break;
            default:
                characters = '0123456789';
        }

        let code = '';
        for (let i = 0; i < pinLength; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return code;
    }

    function pad2(n) { return n < 10 ? '0' + n : n }

    function generateCodes() {
        const codeType = document.querySelector('#code-type').value;
        const pinLength = pinLengthInput.value;
        const actualDate = new Date();

        tmpDate = actualDate.getFullYear().toString().slice(2,4) + pad2(actualDate.getMonth() + 1) + pad2( actualDate.getDate()) + '-' + pad2( actualDate.getHours() ) + pad2( actualDate.getMinutes() ) + pad2( actualDate.getSeconds() );

        let trafficLimit = 0;
        let list = '';

        pinLengthLabel.textContent = pinLength;
        codeContainer.innerHTML = '';

        if ( parseInt( document.querySelector('#traffic-limit').value ) > 0 ) {
            trafficLimit = parseInt( document.querySelector('#traffic-limit').value );
        }

        for (let i = 0; i < quantity.value; i++) {
            let code = '';
            
            if (charTypeSelect.value === 'custom') {
                if ( customCharsInput.value.length > 0 ) {
                    code = generateCode(pinLength, charTypeSelect.value, customCharsInput.value);
                } else {
                    code = generateCode(pinLength, 'numeric', customCharsInput.value);
                }
            } else {
                code = generateCode(pinLength, charTypeSelect.value, customCharsInput.value);
            }

            let profileName = profileSelect.value;
            
            if (profileSelect.value === 'Personalizado') {
                profileName = customProfileInput.value;
                
            }

            let command = '';

            if ( i == 0 ) {
                command += `/ip hotspot user;`;
            }

            command += ` add name="${code}"`;

            if (codeType === "1") {
                let password = "";

                if ( charTypeSelect.value == 'custom') {
                    if ( customCharsInput.value.length > 0 ) {
                        password = generateCode(pinLength, charTypeSelect.value, customCharsInput.value);
                    } else {
                        password = generateCode(pinLength, 'numeric', customCharsInput.value);
                    }
                } else {
                    password = generateCode(pinLength, charTypeSelect.value, customCharsInput.value);
                }

                command += ` password="${password}"`;

                const codeCard = document.createElement('div');
                const codeElement = document.createElement('div');
                
                codeCard.classList.add('code-card');
                codeElement.classList.add('code');
                codeElement.innerHTML = `<strong>Usuario:</strong> ${code}<br><strong>Contraseña:</strong> ${password}<br><strong>Precio:</strong> $${priceInput.value}<br></strong> ${messageField.value}`;

                codeCard.append(codeElement);
                codeContainer.append(codeCard);
            } else {
                const codeCard = document.createElement('div');
                const codeElement = document.createElement('div');
                
                codeCard.classList.add('code-card');
                codeElement.classList.add('code');
                codeElement.innerHTML = `<strong>PIN:</strong> ${code}<br><strong>Precio:</strong> $${priceInput.value}<br><strong></strong> ${messageField.value}`;

                codeCard.append(codeElement);
                codeContainer.append(codeCard);

                if ( codeType == "2" ) {
                    command += ` password="${code}"`;
                }
            }

            if ( hotspotServer.value === 'Personalizado' ) {
                command += ` profile="${profileName}" server="${customServerInput.value}" disabled=no limit-uptime="${days.value}d ${hours.value}:${minutes.value}:${seconds.value}"`;
            } else {
                command += ` profile="${profileName}" server="${hotspotServer.value}" disabled=no limit-uptime="${days.value}d ${hours.value}:${minutes.value}:${seconds.value}"`;
            }

            if (trafficLimit) {
                command += ` limit-bytes-total="${trafficLimit}M"`;
            }

            command += ';';
            list += command;
        }

        generatedList.value = list;
        enableButtons();
    }

    function copyToClipboard() {
        generatedList.select();
        document.execCommand('copy');
        swal('Copiado','El script ha sido copiado exitosamente al portapapeles.','success');
    }

    function downloadScript() {
        const blob = new Blob([generatedList.value], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const enlace = document.createElement('a');

        enlace.setAttribute('href', url);

        if ( profileSelect.value === 'Personalizado' ) {
            enlace.setAttribute('download', `${quantity.value}-tickets-${customProfileInput.value}-${tmpDate}.rsc`);
        } else {
            enlace.setAttribute('download', `${quantity.value}-tickets-${profileSelect.value}-${tmpDate}.rsc`);
        }

        document.querySelector('body').append(enlace);
        enlace.click();
        enlace.remove();
        window.URL.revokeObjectURL(url);
    }

    function printCodes() {
        document.querySelector('section').classList.add('d-none');

        if ( profileSelect.value === 'Personalizado' ) {
            document.title = `${quantity.value}-tickets-${customProfileInput.value}-${tmpDate}`;
        } else {
            document.title = `${quantity.value}-tickets-${profileSelect.value}-${tmpDate}`;
        }

        window.print();
        document.title = `Generador`;
        document.querySelector('section').classList.remove('d-none');
    }

    function cleanAll() {
        quantity.value = '0';
        document.querySelector('#traffic-limit').value = '0';
        priceInput.value = '0';
        messageField.value = '';
        profileSelect.value = 'TiempoCorrido';
        charTypeSelect.value = 'numeric';
        pinLengthInput.value = 4;
        days.value = 0;
        hours.value = 0;
        minutes.value = 0;
        seconds.value = 0;
        
        if ( !customCharsGroup.classList.contains('d-none') ) {
            customCharsGroup.classList.add('d-none');
        }
        
        customCharsInput.value = '';
        generatedList.value = '';
        codeContainer.innerHTML = '';
        window.location.reload();
    }

    function verify() {
        generatedList.value = '';
        codeContainer.innerHTML = '';

        if ( parseInt( quantity.value ) > 0 ) {
            let vars = [ true, true, true, true, false ];

            if ( profileSelect.value === 'Personalizado' ) {
                if ( customProfileInput.value.length == 0 ) {
                    vars[0] = false;
                    swal('Advertencia','Debes escribir el nombre del perfil en el campo "Perfil personalizado".','warning');
                }
            }

            if  ( charTypeSelect.value === 'custom' && vars[0] ) {
                if ( customCharsInput.value.length == 0 ) {
                    vars[1] = false;
                    swal('Advertencia','Debes escribir los caracteres deseados en el campo "Caracteres personalizados".','warning');
                }
            }
            
            if ( hotspotServer.value === 'Personalizado' && vars[0] && vars[1] ) {
                if ( customServerInput.value.length == 0 ) {
                    vars[2] = false;
                    swal('Advertencia','Debes escribir el nombre del servidor en el campo "Servidor personalizado".','warning');
                }
            }
            
            if ( parseFloat( priceInput.value ) == 0 && vars[0] && vars[1] && vars[2] ) {
                vars[3] = false;
                swal('Advertencia','El precio mínimo es de 0.01','warning');
            }
            
            if ( parseInt( days.value ) > 0 || parseInt( hours.value ) > 0 || parseInt( minutes.value ) > 0 || parseInt( seconds.value ) > 0 ) {
                vars[4] = true;
            } else {
                swal('Advertencia','Debes ingresar el tiempo (días, horas, minutos o segundos)','warning');
            }

            if ( vars[0] && vars[1] && vars[2] && vars[3] && vars[4] ) {
                generateCodes();
            }
        } else {
            swal('Advertencia','La cantidad mínima a generar es de 1.','warning');
        }
    }

    for (let indexProfiles = 0; indexProfiles < data.profiles.length; indexProfiles++) {
        let option0 = document.createElement('option');
        option0.setAttribute('value', data.profiles[indexProfiles]);
        option0.textContent = data.profiles[indexProfiles];
        profileSelect.appendChild(option0);
    }
    
    let option1 = document.createElement('option');
    option1.setAttribute('value', 'Personalizado');
    option1.textContent = 'Personalizado';
    profileSelect.appendChild(option1);

    for (let indexServers = 0; indexServers < data.servers.length; indexServers++) {
        let option2 = document.createElement('option');
        option2.setAttribute('value', data.servers[indexServers]);
        option2.textContent = data.servers[indexServers];
        hotspotServer.appendChild(option2);
    }

    let option3 = document.createElement('option');
    option3.setAttribute('value', 'Personalizado');
    option3.textContent = 'Personalizado';
    hotspotServer.appendChild(option3);

    profileSelect.addEventListener('change', handleProfileChange);
    charTypeSelect.addEventListener('change', handleCharTypeChange);
    hotspotServer.addEventListener('change', handleServerChange);
    pinLengthInput.addEventListener('input', () => { pinLengthLabel.textContent = pinLengthInput.value; });
    btnGenerate.addEventListener('click', verify);
    btnCopy.addEventListener('click', copyToClipboard);
    btnDownload.addEventListener('click', downloadScript);
    btnPrint.addEventListener('click', printCodes);
    btnClean.addEventListener('click', cleanAll);
}
