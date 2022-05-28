import { SketchPicker } from 'react-color';
import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function TagColorPicker() {
  const dispatch = useDispatch();

  const state = useSelector(state => state.todos);
  const colorsFromState = useSelector(state => state.colors);

  const menu = useRef("");
  const rightPane = useRef("");

  const [width, setWidth] = useState(0)
  const [selectedTag, setSelectedTag] = useState("");
  const [color, setColor] = useState('#fe752d');

  const keys = Object.keys(state);
  const boards = keys.map(key => state[key]);

  const presetColors = [
    '#FFB5E8',
    '#FF9CEE',
    '#B28DFF',
    '#DCD3FF',
    '#AFF8DB',
    '#C4FAF8',
    '#85E3FF',
    '#BFFCC6',
    '#DBFFD6',
    '#F3FFE3',
    '#FFF5BA',
    '#FFABAB',
    '#FFCBC1',
    '#6f4e37',
  ];
  // boards = [[{todo: "asd", id: "asd"}], [{todo: "asd", id: "asd"}, {todo: "asd", id: "asd"}], [{todo: "asd", id: "asd"}]]
  //collpase all todos into one array
  let tags = [];
  boards.forEach(board => {
    board.forEach(todo => {
      todo.tags.forEach(tag => {
        tags.push(tag);
      })
    })
  });

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWidth((menu.current.clientWidth + 10) + "px")
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  useEffect(() => {
    if(selectedTag !== ""){
      rightPane.current.classList.remove("hidden");
    } else {
      rightPane.current.classList.add("hidden");
    }
  }, [selectedTag])

  tags = [...new Set(tags)];
  tags = tags.sort();
  //tags = tags.map(tag => tag.toLowerCase());

  let tagsAsObject = [];
  tags.forEach(tag => {
    tagsAsObject.push({
      tag: tag,
      color: ""
    })
  });

  //go through all colors from state and set the color for each tag
  if(colorsFromState){
    colorsFromState.forEach(colorFromState => {
      tagsAsObject.forEach(tag => {
        if(tag.tag === colorFromState.tag){
          tag.color = colorFromState.color;
        }
      })
    });
  }

  function generateRandomColors(){
    let randomColors = [];
    tags.forEach(tag => {
      randomColors.push({tag: tag, color: `#${Math.floor(Math.random() * 16777215).toString(16)}`});
    });
    dispatch({ type: 'SET_COLORS', payload: randomColors });
  }

  function randomPresetColors(){
    let randomColors = [];
    
    tags.forEach(tag => {
      randomColors.push({tag: tag, color: presetColors[Math.floor(Math.random() * (presetColors.length - 1))]});
    });
    dispatch({ type: 'SET_COLORS', payload: randomColors });
  }

  function onComplete(){
    //make tags an array of objects with tag and color
    //loop through tags and find the one that matches the selected tag
    //set the color to that tag's color
    
    tagsAsObject.forEach(tag => {
      if(tag.tag === selectedTag){
        tag.color = color;
      }
    });

    setSelectedTag("")

    dispatch({ type: 'SET_COLORS', payload: tagsAsObject });
  }

  function selectTag(tag){
    setSelectedTag(tag);
  }

  function deselect() {
    setSelectedTag("");
  }

  var element = document.createElement('style'),
	sheet;

  // Append style element to head
  document.head.appendChild(element);

  // Reference to the stylesheet
  sheet = element.sheet;

  // Add CSS rules for all tags to have background-color set to the color of the tag
  tagsAsObject.forEach(tag => {
    let textStyle = "";
    var textColor = tag.color.substring(1);      // strip #
    var rgb = parseInt(textColor, 16);   // convert rrggbb to decimal
    var r = (rgb >> 16) & 0xff;  // extract red
    var g = (rgb >>  8) & 0xff;  // extract green
    var b = (rgb >>  0) & 0xff;  // extract blue
    
    var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    
    if (luma > 90) {
      textStyle = "#000"
    } else if(luma === 0){
      textStyle = "#000"
    } else {
      textStyle = "#fff"
    }
    //remove spaces from tag.tag
    let tagName = tag.tag.replace(/\s/g, '');
    sheet.insertRule(`.${tagName.toLowerCase()} { background-color: ${tag.color}; color: ${textStyle} }`, sheet.cssRules.length);
  });

  function openColorPicker() {
    menu.current.classList.toggle("openedColorPicker");
    rightPane.current.classList.add("hidden");
    setSelectedTag("");
  }

  return (
    <div className='colorPickerMenu' ref={menu} style={{transform: `translateX(${width})`}}>
      <div className='colorPickerMenuLeft' ref={rightPane}>
        <SketchPicker color={color} presetColors={presetColors} onChange={color => {
          setColor(color.hex);
        }} />
        <button onClick={(e)=> {onComplete(); e.stopPropagation()}} className="saveColor">Save</button>
        
      </div>
      <div className='colorPickerMenuRight' onClick={() => {setSelectedTag("")}}>
        <h1>Tags</h1>
        <p>Click on a tag to edit it's color</p>
        <div className='color-picker-tags'>
          {tags.map((tag, index) => {
            let thisTagsColor = "";
            let thisTagsTextColor = "";
            tagsAsObject.forEach(tagsObjTag => {
              if(tagsObjTag.tag === tag){
                thisTagsColor = tagsObjTag.color;
              }
            });
            var textColor = thisTagsColor.substring(1);      // strip #
            var rgb = parseInt(textColor, 16);   // convert rrggbb to decimal
            var r = (rgb >> 16) & 0xff;  // extract red
            var g = (rgb >>  8) & 0xff;  // extract green
            var b = (rgb >>  0) & 0xff;  // extract blue
            
            var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
            
            if (luma > 90) {
              thisTagsTextColor = "#000"
            } else if(luma === 0){
              thisTagsTextColor = "#000"
            } else {
              thisTagsTextColor = "#fff"
            }
            return (
              <div key={index} onClick={(e)=>{selectTag(tag); e.stopPropagation(); }} 
              className={`color-picker-tag ${selectedTag === tag ? "selected" : ""}`}
              style={selectedTag === tag ? {color: thisTagsTextColor, backgroundColor: color} : {color: thisTagsTextColor, backgroundColor: thisTagsColor}}>
                {tag}
              </div>
            )
          })}
          <button className='randomizeColors' onClick={generateRandomColors}>Random colors for all tags</button>
          <button className='randomizeColors' onClick={randomPresetColors}>Random pastel color for all tags</button>
          <button className='deselectTag' onClick={deselect}>Deselect</button>
        </div>
        <button className='closeColorPicker' onClick={openColorPicker}>Close</button>
      </div>
    </div>
  )
}