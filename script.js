document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const presetSelect = document.getElementById("preset-select");
  const presetDescription = document.getElementById("preset-description");
  const contextContainer = document.getElementById("context-container");
  const finalPromptTextarea = document.getElementById("final-prompt");
  const copyButton = document.getElementById("copy-button");
  const copyFeedback = document.getElementById("copy-feedback");

  // All parameter inputs that can trigger a prompt update
  const parameterInputs = [
    document.getElementById("audience-select"),
    document.getElementById("tone-select"),
    document.getElementById("length-select"),
    document.getElementById("format-select"),
    document.getElementById("language-select"),
  ];

  let presets = [];
  let currentPreset = null;

  // --- Functions ---

  /**
   * Fetches presets from the JSON file and populates the dropdown.
   */
  async function initializeApp() {
    try {
      const response = await fetch("presets.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      presets = await response.json();
      populatePresetDropdown();
    } catch (error) {
      console.error("Could not load presets:", error);
      presetDescription.textContent =
        "Грешка: presets.json не можа да бъде зареден.";
    }
  }

  /**
   * Populates the main preset selector dropdown.
   */
  function populatePresetDropdown() {
    presets.forEach((preset) => {
      const option = document.createElement("option");
      option.value = preset.id;
      option.textContent = preset.displayName;
      presetSelect.appendChild(option);
    });
  }

  /**
   * Displays the fields and description for the selected preset.
   */
  function displayPreset(presetId) {
    currentPreset = presets.find((p) => p.id === presetId);
    contextContainer.innerHTML = ""; // Изчистване на предишните полета

    if (!currentPreset) {
      presetDescription.textContent = "";
      updateFinalPrompt();
      return;
    }

    presetDescription.textContent = currentPreset.description;

    // Генериране на динамичните полета за контекст
    currentPreset.contextFields.forEach((field) => {
      const fieldContainer = document.createElement("div");

      const labelWrapper = document.createElement("div");
      labelWrapper.className = "label-wrapper";

      const label = document.createElement("label");
      label.setAttribute("for", field.name);
      label.textContent = field.label;
      labelWrapper.appendChild(label);

      // Добавяне на икона за помощ, само ако има placeholder
      if (field.placeholder) {
        const tooltipContainer = document.createElement("div");
        tooltipContainer.className = "tooltip-container";

        const helperIcon = document.createElement("span");
        helperIcon.className = "helper-icon";
        helperIcon.textContent = "ℹ️";
        tooltipContainer.appendChild(helperIcon);

        const tooltipText = document.createElement("span");
        tooltipText.className = "tooltip-text";
        tooltipText.textContent = field.placeholder;
        tooltipContainer.appendChild(tooltipText);

        // Добавяне на event listener за копиране при клик
        tooltipContainer.addEventListener("click", (e) => {
          e.stopPropagation(); // Спираме event-a, за да не се задействат други
          navigator.clipboard
            .writeText(field.placeholder)
            .then(() => {
              const originalText = tooltipText.textContent;
              tooltipText.textContent = "Копирано!";
              tooltipContainer.classList.add("copied");
              setTimeout(() => {
                tooltipText.textContent = originalText;
                tooltipContainer.classList.remove("copied");
              }, 1500);
            })
            .catch((err) => {
              console.error("Неуспешно копиране на placeholder: ", err);
            });
        });

        labelWrapper.appendChild(tooltipContainer);
      }

      fieldContainer.appendChild(labelWrapper);

      let input;
      if (field.type === "textarea") {
        input = document.createElement("textarea");
        input.rows = 5;
      } else {
        input = document.createElement("input");
        input.type = field.type;
      }

      input.id = field.name;
      input.name = field.name;
      input.placeholder = field.placeholder || "";
      input.addEventListener("input", updateFinalPrompt);

      fieldContainer.appendChild(input);
      contextContainer.appendChild(fieldContainer);
    });

    updateFinalPrompt();
  }

  /**
   * Gathers all data and constructs the final prompt.
   */
  function updateFinalPrompt() {
    if (!currentPreset) {
      finalPromptTextarea.value = "";
      return;
    }

    let prompt = currentPreset.promptTemplate;

    // Replace global parameters
    const paramValues = {
      audience: document.getElementById("audience-select").value,
      tone: document.getElementById("tone-select").value,
      length: document.getElementById("length-select").value,
      format: document.getElementById("format-select").value,
      language: document.getElementById("language-select").value,
    };

    for (const [key, value] of Object.entries(paramValues)) {
      prompt = prompt.replace(new RegExp(`{${key}}`, "g"), value);
    }

    // Replace dynamic context fields
    currentPreset.contextFields.forEach((field) => {
      const inputElement = document.getElementById(field.name);
      if (inputElement) {
        prompt = prompt.replace(
          new RegExp(`{${field.name}}`, "g"),
          inputElement.value
        );
      }
    });

    finalPromptTextarea.value = prompt;
  }

  /**
   * Copies the final prompt text to the clipboard.
   */
  function copyToClipboard() {
    if (!finalPromptTextarea.value) return;

    navigator.clipboard
      .writeText(finalPromptTextarea.value)
      .then(() => {
        copyFeedback.textContent = "Копирано!";
        setTimeout(() => {
          copyFeedback.textContent = "";
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
        copyFeedback.textContent = "Неуспешно копиране.";
      });
  }

  // --- Event Listeners ---
  presetSelect.addEventListener("change", (e) => displayPreset(e.target.value));
  parameterInputs.forEach((input) =>
    input.addEventListener("change", updateFinalPrompt)
  );
  copyButton.addEventListener("click", copyToClipboard);

  // --- Initial Load ---
  initializeApp();
});
