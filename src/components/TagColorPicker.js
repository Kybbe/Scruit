import { SketchPicker } from 'react-color';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function TagColorPicker() {
  const state = useSelector(state => state.todos);
  const colorsFromState = useSelector(state => state.colors);
  const dispatch = useDispatch();
  const keys = Object.keys(state);
  const boards = keys.map(key => state[key]);
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

  tags = [...new Set(tags)];
  tags = tags.sort();
  //tags = tags.map(tag => tag.toLowerCase());
  console.log("tags ", tags);

  let tagsAsObject = [];
  tags.forEach(tag => {
    tagsAsObject.push({
      tag: tag,
      color: ""
    })
  });

  console.log("tagsAsObj ", tagsAsObject);

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

  const [selectedTag, setSelectedTag] = useState("");
  const [color, setColor] = useState('#fe752d');
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

  function onComplete(){
    //make tags an array of objects with tag and color
    //loop through tags and find the one that matches the selected tag
    //set the color to that tag's color
    
    tagsAsObject.forEach(tag => {
      if(tag.tag === selectedTag){
        tag.color = color;
      }
    });
    console.log("tagsASObj in onComplete ", tagsAsObject);

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
    
    if (luma < 90) {
      textStyle = "#fff"
    } else {
      textStyle = "#000"
    }
    sheet.insertRule(`.${tag.tag.toLowerCase()} { background-color: ${tag.color}; color: ${textStyle} }`, sheet.cssRules.length);
  });

  function openColorPicker() {
    document.getElementsByClassName("colorPickerMenu")[0].classList.toggle("openedColorPicker");
  }

  return (
    <div className='colorPickerMenu'>
      <div className='colorPickerMenuLeft'>
        <SketchPicker color={color} presetColors={presetColors} onChange={color => {
          setColor(color.hex);
        }} />
        <button onClick={onComplete} className="saveColor">Save</button>
        
        <button className='closeColorPicker' onClick={openColorPicker}>Close</button>
      </div>
      <div className='colorPickerMenuRight'>
        <h1>Tags</h1>
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
            
            if (luma < 90) {
              thisTagsTextColor = "#fff"
            } else {
              thisTagsTextColor = "#000"
            }
            return (
              <div key={index} onClick={()=>{selectTag(tag)}} 
              className={`color-picker-tag ${selectedTag === tag ? "selected" : ""}`}
              style={selectedTag === tag ? {color: thisTagsTextColor, backgroundColor: color} : {color: thisTagsTextColor, backgroundColor: thisTagsColor}}>
                {tag}
              </div>
            )
          })}
          <button className='deselectTag' onClick={deselect}>Deselect</button>
        </div>
      </div>
    </div>
  )
}