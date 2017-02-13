      {
         "title": "InputGraphComplete",
         "prependFeedback": "<table cellspacing=\"10\" cellpadding=\"10\" style=\"background-color:rgba(50,50,30,1.0);\"><tbody><tr><td><h3 style=\"color:#FFF\">Be a Leo:</h3><img src=\"assets/Kid3.png\"/></td><td style=\"margin: 10px; border-radius: 20px; color: rgba(50,50,30,1.0); background-color: rgba(255,255,200,1.0);\" align=\"left\">",
         "appendFeedback": "</td></tr></tbody></table>",
         "setCompletedMinScore": 2,
         "setFinalFeedbackScore":2,
         "rules": [
            {
               "seriesId":"Input",
               "label":"seg1",
               "width_min":1000,
               "collapse_inline_points": 5,
               "xbounds_min":0,
               "ybounds_min":0,
               "xbounds_max":5000,
               "ybounds_max":100
            },
            {
               "seriesId":"Input",
               "label":"seg2",
               "width_min":1000,
               "collapse_inline_points": 5
            },
            {
               "seriesId":"Input",
               "label":"seg3",
               "width_min":1000,
               "collapse_inline_points": 5
            },
            {
               "seriesId":"Input",
               "label":"seg4",
               "width_min":1000,
               "collapse_inline_points": 5
            },
            {
               "seriesId":"Input",
               "label":"seg5",
               "width_min":1000,
               "collapse_inline_points": 5
            },
            {
               "seriesId": "Input",
               "label": "change",
               "relation": "R[seg2].y1!=null && Math.abs(R[seg1].y1 - R[seg2].y1) >= 50 || R[seg3].y1!=null && Math.abs(R[seg1].y1 - R[seg3].y1) >= 50 || R[seg4].y1!=null && Math.abs(R[seg1].y1 - R[seg4].y1) >= 50 || R[seg5].y1!=null && Math.abs(R[seg1].y1 - R[seg5].y1) >= 50 || R[seg3].y1!=null && Math.abs(R[seg2].y1 - R[seg3].y1) >= 50 || R[seg4].y1!=null && Math.abs(R[seg2].y1 - R[seg4].y1) >= 50 || R[seg5].y1!=null && Math.abs(R[seg2].y1 - R[seg5].y1) >= 50 || R[seg4].y1!=null && Math.abs(R[seg3].y1 - R[seg4].y1) >= 50 || R[seg5].y1!=null && Math.abs(R[seg3].y1 - R[seg4].y1) >= 50 || R[seg5].y1!=null && Math.abs(R[seg4].y1 - R[seg5].y1) >= 50"
            },
            {
               "seriesId": "Input",
               "label": "spans-x",
               "width_min": 4000,
               "collapse_inline_points": 180,
               "return_to_point": 0
            },
            {
               "seriesId": "Input",
               "label": "falling",
               "width_min": 2000,
               "height_max": -50,
               "collapse_inline_points": 10,
               "return_to_point": 0
            },
            {
               "seriesId": "Input",
               "label": "rising",
               "width_min": 2000,
               "height_min": 50,
               "collapse_inline_points": 10,
               "return_to_point": 0
            },
            {
               "seriesId": "Input",
               "label": "g0pts",
               "npoints_min": 1
            },
            {
               "seriesId": "Input",
               "label": "g1pt",
               "npoints_min": 2
            },
            {
               "seriesId": "Input",
               "label": "g5pts",
               "npoints_min": 6
            }
         ],
         "scores": [     
            {
               "pattern": "R[rising]||R[falling]||R[change]",
               "score": 2
            },       
            {
               "pattern": "R[g0pts]",
               "score": 1
            },
            {
               "pattern": "true",
               "score": 0
            }
         ],
         "feedbacks": [
            {
               "pattern": "R[rising]||R[falling]||R[change]",
                "feedback": "<h3>Very Good!</h3><p style='border:20px;'> Now check the graph, are the lines similar?</p>"
            },
            {
               "pattern": "R[spans-x]&&R[g5pts]",
                "feedback": "<h3>Try Running the Model Again</h3><p style='border:20px;'>It looks like you are changing the line too quickly. Try to increase the line. Don't be a Lisa! </p>"
            },
               "pattern": "R[spans-x]",
                "feedback": "<h3>Try Running the Model Again</h3><p style='border:20px;'>This time make sure to change the level.</p>"
            },
            {
               "pattern": "R[g1pt]",
               "feedback": "<h3>Gather More Evidence</h3><p style='border:20px;'>Try running the model for the full Time.</p>"
            },
            {
               "pattern": "true",
               "feedback": "<h3>Run the Model!</h3><p style='border:20px;'>Read the directions or ask the teacher how to make this model work.</p>"
            }
         ]
      }